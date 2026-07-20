import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { JobRepository } from '@/server/repositories/job-repository';
import { db } from '@/server/db';
import { jobAnalyses, proposals as proposalsTable } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { JobDetailClient } from './client-page';

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const resolvedParams = await params;

  // 1. Check Job Repository directly ensuring authorization bounding
  const repository = new JobRepository();
  const job = await repository.findByIdAndUserId(
    resolvedParams.id,
    session.user.id,
  );

  if (!job) {
    notFound();
  }

  // 2. Fetch specific relations directly using Drizzle inside Server Component
  const [analysis] = await db
    .select()
    .from(jobAnalyses)
    .where(eq(jobAnalyses.jobId, job.id));

  const proposals = await db
    .select()
    .from(proposalsTable)
    .where(eq(proposalsTable.jobId, job.id))
    .orderBy(desc(proposalsTable.createdAt));

  return (
    <JobDetailClient job={job} analysis={analysis} proposals={proposals} />
  );
}
