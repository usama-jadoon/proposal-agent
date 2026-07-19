import { z } from "zod";
import { BaseAgent } from "../core/base-agent";
import { SystemPrompts } from "../prompts/system-prompts";

export const proposalWriterSchema = z.object({
  proposal: z.string().describe("100-150 words personalized Upwork proposal"),
});

export class ProposalWriterAgent extends BaseAgent<typeof proposalWriterSchema> {
  name = "proposal_writer_agent";
  schema = proposalWriterSchema;

  protected getSystemPrompt() {
    return `${SystemPrompts.WRITER}
    
STEP 9 — Final Proposal
Write a personalized Upwork proposal.
Requirements:
100–150 words.
Personalized opening hook.
Pain point address.
Business impact.
Solution.
Relevant proof.
Clear CTA.

Do not use bullet points. Do not copy the client's wording. Focus on business outcomes.`;
  }
}
