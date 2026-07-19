import { JobRepository } from "@/server/repositories/job-repository";
import { JobParser } from "./job-parser";
import type { ImportJobInput } from "./job-validator";
import type { Job } from "@/server/db/types";

export class JobService {
  private repository: JobRepository;

  constructor() {
    this.repository = new JobRepository();
  }

  /**
   * Orchestrates the ingestion of a new Upwork Job.
   * Intercepts duplicates by checking the parsed URL hash.
   */
  async ingestJob(userId: string, input: ImportJobInput): Promise<{ job: Job; isDuplicate: boolean }> {
    // 1. Normalize unique identifier
    const upworkJobId = JobParser.extractUpworkIdFromUrl(input.url);

    // 2. Duplicate Detection
    const existingJob = await this.repository.findByUpworkId(upworkJobId);
    if (existingJob) {
      // If it exists, return it cleanly identifying it as a duplicate
      // (Rather than throwing a database constraint error)
      return { job: existingJob, isDuplicate: true };
    }

    // 3. Format loosely structured metadata
    const budgetInfo = JobParser.formatBudgetInfo(input.budget, input.hourlyRate);

    // 4. Ingest via Repository
    const newJob = await this.repository.create({
      userId,
      upworkJobId,
      title: input.title,
      description: input.description,
      url: input.url,
      skills: input.skills,
      budgetInfo,
      clientInfo: {}, // Default empty struct ready for Phase 5 orchestration
      postedAt: new Date(), // Extracted roughly at time of sync
    });

    return { job: newJob, isDuplicate: false };
  }
}
