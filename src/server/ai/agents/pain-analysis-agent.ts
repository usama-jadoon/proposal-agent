import { z } from "zod";
import { BaseAgent } from "../core/base-agent";
import { SystemPrompts } from "../prompts/system-prompts";

export const painAnalysisSchema = z.object({
  biggestBusinessProblem: z.string().describe("Identify the client's biggest business problem"),
  whyProblemExists: z.string().describe("Why the problem exists"),
  rootCause: z.string().describe("Root cause"),
  whyPreviousAttemptsFailed: z.string().describe("Why previous attempts may have failed"),
  businessImpact: z.string().describe("Business impact"),
  revenueImpact: z.string().describe("Revenue impact"),
  productivityImpact: z.string().describe("Productivity impact"),
  opportunityCost: z.string().describe("Opportunity cost"),
  riskIfIgnored: z.string().describe("Risk if ignored"),
});

export class PainAnalysisAgent extends BaseAgent<typeof painAnalysisSchema> {
  name = "pain_analysis_agent";
  schema = painAnalysisSchema;

  protected getSystemPrompt() {
    return `${SystemPrompts.CONSULTANT}
    
STEP 2 — Root Pain Analysis
Identify the client's biggest business problem.
Provide analytical insight breaking down root causes and impacts.`;
  }
}
