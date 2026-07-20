import { z } from 'zod';
import { BaseAgent } from '../core/base-agent';

export const qualityReviewSchema = z.object({
  isPassable: z
    .boolean()
    .describe('Does this proposal meet strict quality standards?'),
  critique: z.string().describe('If false, why does it fail?'),
  readingLevel: z.string().describe('Grade level of reading'),
});

export class QualityReviewAgent extends BaseAgent<typeof qualityReviewSchema> {
  name = 'quality_review_agent';
  schema = qualityReviewSchema;

  protected getSystemPrompt() {
    return `You are a tough Quality Assurance Reviewer grading Upwork Proposals against strict psychological & stylistic limits.
Does it use forbidden words? (Passionate, Excited, Rockstar, Ninja, I understand your requirements)? If yes, FAIL.
Is it overly vague or using AI sounding language? If yes, FAIL.
Return a boolean score and brutal critique.`;
  }
}
