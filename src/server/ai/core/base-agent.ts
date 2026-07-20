import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { omnirouteClient } from '../omniroute/client';
import { ModelConfig } from '../omniroute/config';
import { db } from '@/server/db';
import { agentRuns } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export abstract class BaseAgent<T extends z.ZodTypeAny> {
  protected abstract name: string;
  protected abstract schema: T;
  protected abstract getSystemPrompt(): string;
  protected model: string = ModelConfig.PRIMARY;

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async executeWithRetry(params: any): Promise<any> {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        return await omnirouteClient.chat.completions.create(params);
      } catch (error: any) {
        attempt++;

        const isRateLimit = error?.status === 429;
        const isTimeout =
          error?.status === 408 ||
          error?.status === 504 ||
          error?.code === 'ETIMEDOUT';
        const isServerError = error?.status >= 500 && error?.status < 600;

        if (
          attempt >= MAX_RETRIES ||
          (!isRateLimit && !isTimeout && !isServerError)
        ) {
          logger.error(
            `AI execution failed completely after ${attempt} attempts`,
            {
              agent: this.name,
              error: error?.message || 'Unknown error',
              status: error?.status,
            },
          );
          throw error;
        }

        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        logger.warn(
          `AI execution retry ${attempt}/${MAX_RETRIES} due to ${error?.status || 'network error'}... waiting ${delay}ms`,
          { agent: this.name },
        );

        await this.sleep(delay);
      }
    }
  }

  async execute(
    userId: string,
    jobId: string,
    userMessage: string,
  ): Promise<z.infer<T>> {
    // 1. Initial logging
    const [run] = await db
      .insert(agentRuns)
      .values({
        userId,
        jobId,
        status: 'running',
      })
      .returning();

    logger.info(`Starting execution of ${this.name}`, {
      userId,
      jobId,
      runId: run.id,
    });

    try {
      // 2. Format schema for OmniRoute/OpenAI Structured JSON
      const jsonSchema = zodToJsonSchema(this.schema, 'result');

      // 3. Make the API Call via OmniRoute proxy with Retry
      const completion = await this.executeWithRetry({
        model: this.model,
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: userMessage },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: this.name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 64),
            schema: (jsonSchema as any).definitions?.result || jsonSchema,
            strict: true,
          },
        },
        temperature: ModelConfig.DEFAULT_TEMPERATURE,
        // Enforce sensible timeout so it doesn't hang forever on the vercel edge
        timeout: 45000,
      });

      const responseContent = completion.choices[0]?.message.content;

      if (!responseContent) {
        throw new Error('No payload returned from OmniRoute');
      }

      // 4. Parse safely natively via Zod matching Types
      const parsedData = this.schema.parse(JSON.parse(responseContent));

      // 5. Update success logs securely
      await db
        .update(agentRuns)
        .set({
          status: 'completed',
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          completedAt: new Date(),
        })
        .where(eq(agentRuns.id, run.id));

      logger.info(`Successfully completed ${this.name}`, {
        userId,
        jobId,
        tokens: completion.usage?.total_tokens,
      });

      return parsedData;
    } catch (error) {
      // 6. Graceful failure logging catching the error bounds
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown AI error';

      logger.error(`Execution failed for ${this.name}`, {
        userId,
        jobId,
        error: errorMessage,
      });

      await db
        .update(agentRuns)
        .set({
          status: 'failed',
          errorMessage: errorMessage,
          completedAt: new Date(),
        })
        .where(eq(agentRuns.id, run.id));

      throw error;
    }
  }
}
