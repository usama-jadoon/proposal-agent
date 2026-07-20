import { db } from '@/server/db';
import { jobs } from '@/server/db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
import type { NewJob, Job } from '@/server/db/types';

export class JobRepository {
  /**
   * Find a job by its unique upworkJobId.
   */
  async findByUpworkId(upworkJobId: string): Promise<Job | undefined> {
    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.upworkJobId, upworkJobId));
    return result[0];
  }

  /**
   * Insert a new job into the database.
   */
  async create(jobData: NewJob): Promise<Job> {
    const [inserted] = await db.insert(jobs).values(jobData).returning();
    return inserted;
  }

  /**
   * Get paginated jobs for a specific user, sorted newest first by creation.
   */
  async getPaginatedByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ data: Job[]; total: number }> {
    const totalResult = await db
      .select({ value: count() })
      .from(jobs)
      .where(eq(jobs.userId, userId));

    const data = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, userId))
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: totalResult[0].value,
    };
  }

  /**
   * Find a specific job by ID, ensuring it belongs to the authenticated user.
   */
  async findByIdAndUserId(
    jobId: string,
    userId: string,
  ): Promise<Job | undefined> {
    const result = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, userId)));

    return result[0];
  }
}
