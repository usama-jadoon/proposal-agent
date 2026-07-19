import { z } from "zod";
import { BaseAgent } from "../core/base-agent";
import { SystemPrompts } from "../prompts/system-prompts";

export const qualificationSchema = z.object({
  hiringIntentScore: z.number().min(1).max(10).describe("Estimate how likely this client is to hire someone"),
  hiringIntentReasoning: z.string().describe("Explain your reasoning for the hiring intent score"),
  connectInvestmentScore: z.number().min(1).max(10).describe("Would spending Connects be a smart investment"),
  connectInvestmentReasoning: z.string().describe("Explain why"),
  clientReliabilityScore: z.number().min(1).max(10).describe("Based on historical behavior, how reliable is this client"),
  hiringProbability: z.number().min(0).max(100).describe("Provide an estimated probability percentage"),
  confidenceLevel: z.enum(["High", "Medium", "Low"]).describe("Confidence level of probability"),
  riskFactors: z.array(z.string()).describe("Identify everything that reduces probability of winning"),
  recommendation: z.enum(["Apply Immediately", "Apply Only If You Have a Strong Advantage", "Skip and Save Your Connects"]),
  recommendationReasoning: z.string().describe("Explain why"),
});

export class QualificationAgent extends BaseAgent<typeof qualificationSchema> {
  name = "qualification_agent";
  schema = qualificationSchema;

  protected getSystemPrompt() {
    return `${SystemPrompts.CONSULTANT}
    
STEP 0 — Job Qualification & Client Hiring Intelligence
Analyze every piece of information provided. Identify behavioral patterns.
Provide exact scores, risk factors, and final apply recommendation.`;
  }
}
