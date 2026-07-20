import { z } from 'zod';
import { BaseAgent } from '../core/base-agent';
import { SystemPrompts } from '../prompts/system-prompts';

export const psychologySchema = z.object({
  trueCare: z.string().describe('What does this client truly care about?'),
  biggestFear: z.string().describe('Biggest fear'),
  hiddenFrustration: z.string().describe('Hidden frustration'),
  emotionalTrigger: z.string().describe('Emotional trigger'),
  desiredBusinessOutcome: z.string().describe('Desired business outcome'),
  buyingMotivation: z.string().describe('Buying motivation'),
});

export class ClientPsychologyAgent extends BaseAgent<typeof psychologySchema> {
  name = 'client_psychology_agent';
  schema = psychologySchema;

  protected getSystemPrompt() {
    return `${SystemPrompts.CONSULTANT}
    
STEP 1 — Client Psychology
Determine the underlying psychology of the client based on the job posting.
Support every conclusion with evidence from the job post.`;
  }
}
