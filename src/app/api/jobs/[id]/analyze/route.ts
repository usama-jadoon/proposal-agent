import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AiOrchestrator } from '@/server/ai/orchestrator';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;

    // Rate Limiting: 5 analysis requests per 10 minutes per user
    const rl = await rateLimit(`analyze_${session.user.id}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rl.success) {
      logger.warn('Rate limit exceeded for analyze endpoint', {
        userId: session.user.id,
        jobId: resolvedParams.id,
      });
      return NextResponse.json(
        {
          error:
            'Rate limit exceeded. Please wait before running more analyses.',
        },
        { status: 429, headers: { 'X-RateLimit-Reset': String(rl.resetTime) } },
      );
    }

    // Instantiate Orchestrator and run
    const orchestrator = new AiOrchestrator();

    // Note: Orchestrator internally confirms Job Ownership
    await orchestrator.processJob(session.user.id, resolvedParams.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('AI Analysis Trigger Error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
