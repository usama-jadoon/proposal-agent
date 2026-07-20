import { z } from 'zod';
import { BaseAgent } from '../core/base-agent';
import { SystemPrompts } from '../prompts/system-prompts';

export const hookSchema = z.object({
  hooks: z
    .array(z.string())
    .length(5)
    .describe('List of 5 completely different opening hooks'),
});

export class HookGeneratorAgent extends BaseAgent<typeof hookSchema> {
  name = 'hook_generator_agent';
  schema = hookSchema;

  protected getSystemPrompt() {
    return `${SystemPrompts.CONSULTANT}
    
STEP 3 — Proposal Hooks
Write 5 different opening hooks.
Rules:
- Mention the client's exact pain naturally.
- Demonstrate expertise immediately.
- Never sound generic.
- Never begin with: Hi, Hello, Dear, I read your job post, I can help, I'm interested.
Each hook should feel written exclusively for this client.`;
  }
}
