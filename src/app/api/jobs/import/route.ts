import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { importJobSchema } from '@/server/services/jobs/job-validator';
import { JobService } from '@/server/services/jobs/job-service';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate Limiting: 20 imports per 10 minutes per user
    const rl = await rateLimit(`import_${session.user.id}`, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    if (!rl.success) {
      logger.warn('Rate limit exceeded for import endpoint', {
        userId: session.user.id,
      });
      return NextResponse.json(
        { error: 'Too many jobs imported. Please wait a moment.' },
        { status: 429, headers: { 'X-RateLimit-Reset': String(rl.resetTime) } },
      );
    }

    const payload = await req.json();

    // Validate request using Zod
    const validationResult = importJobSchema.safeParse(payload);
    if (!validationResult.success) {
      logger.warn('Job import validation failed', {
        errors: validationResult.error.format(),
      });
      return NextResponse.json(
        { error: 'Validation Error', details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const jobService = new JobService();

    try {
      const result = await jobService.ingestJob(
        session.user.id,
        validationResult.data,
      );

      logger.info(
        `Job ${result.isDuplicate ? 'duplicated' : 'imported'} successfully`,
        {
          userId: session.user.id,
          jobId: result.job?.id,
        },
      );

      return NextResponse.json(
        {
          message: result.isDuplicate
            ? 'Job already imported'
            : 'Job imported successfully',
          job: result.job,
          status: result.isDuplicate ? 'duplicate' : 'created',
        },
        { status: result.isDuplicate ? 200 : 201 },
      );
    } catch (serviceError) {
      logger.error('Job ingestService error', {
        userId: session.user.id,
        error:
          serviceError instanceof Error
            ? serviceError.message
            : String(serviceError),
      });
      return NextResponse.json(
        {
          error:
            serviceError instanceof Error
              ? serviceError.message
              : 'Service processing failed',
        },
        { status: 422 },
      );
    }
  } catch (error) {
    logger.error('Job Import Global Route Error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
