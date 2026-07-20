import { z } from 'zod';
import { BaseAgent } from '../core/base-agent';
import { SystemPrompts } from '../prompts/system-prompts';

export const solutionSchema = z.object({
  discovery: z.string(),
  audit: z.string(),
  rootCauseAnalysis: z.string(),
  implementation: z.string(),
  testing: z.string(),
  optimization: z.string(),
  reporting: z.string(),
  discoveryQuestions: z
    .array(z.string())
    .length(5)
    .describe('5 intelligent questions to ask the client'),
  ctas: z
    .array(z.string())
    .length(5)
    .describe('5 low-friction calls to action'),
});

export class SolutionStrategyAgent extends BaseAgent<typeof solutionSchema> {
  name = 'solution_strategy_agent';
  schema = solutionSchema;

  protected getSystemPrompt() {
    return `${SystemPrompts.CONSULTANT}
    
STEP 5 — Solution Strategy & STEP 7/8
Explain exactly how you would solve the problem step by step (Discovery through Reporting).
Generate 5 intelligent Discovery Questions avoiding questions already answered.
Write 5 low-friction Calls to Action. Never sound desperate or overly salesy.`;
  }
}
