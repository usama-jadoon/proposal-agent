import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { omnirouteClient } from "../omniroute/client";
import { ModelConfig } from "../omniroute/config";
import { db } from "@/server/db";
import { agentRuns } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export abstract class BaseAgent<T extends z.ZodTypeAny> {
  protected abstract name: string;
  protected abstract schema: T;
  protected abstract getSystemPrompt(): string;
  protected model: string = ModelConfig.PRIMARY;

  async execute(userId: string, jobId: string, userMessage: string): Promise<z.infer<T>> {
    // 1. Initial logging
    const [run] = await db
      .insert(agentRuns)
      .values({
        userId,
        jobId,
        status: "running",
      })
      .returning();

    try {
      // 2. Format schema for OmniRoute/OpenAI Structured JSON
      const jsonSchema = zodToJsonSchema(this.schema, "result");
      
      // 3. Make the API Call via OmniRoute proxy
      const completion = await omnirouteClient.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.getSystemPrompt() },
          { role: "user", content: userMessage }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: this.name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 64),
            schema: (jsonSchema as any).definitions?.result || jsonSchema,
            strict: true
          }
        },
        temperature: ModelConfig.DEFAULT_TEMPERATURE
      });

      const responseContent = completion.choices[0]?.message.content;
      
      if (!responseContent) {
        throw new Error("No payload returned from OmniRoute");
      }

      // 4. Parse safely natively via Zod matching Types
      const parsedData = this.schema.parse(JSON.parse(responseContent));

      // 5. Update success logs securely
      await db
        .update(agentRuns)
        .set({
          status: "completed",
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          completedAt: new Date(),
        })
        .where(eq(agentRuns.id, run.id));

      return parsedData;
    } catch (error) {
      // 6. Graceful failure logging catching the error bounds
      const errorMessage = error instanceof Error ? error.message : "Unknown AI error";
      
      await db
        .update(agentRuns)
        .set({
          status: "failed",
          errorMessage: errorMessage,
          completedAt: new Date(),
        })
        .where(eq(agentRuns.id, run.id));

      throw error;
    }
  }
}
