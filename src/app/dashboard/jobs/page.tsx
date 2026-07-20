import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { JobRepository } from '@/server/repositories/job-repository';
import Link from 'next/link';
import { ImportJobForm } from './import-job-form';

export default async function JobsDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const repository = new JobRepository();
  const result = await repository.getPaginatedByUserId(session.user.id, 20, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Pipeline</h1>
          <p className="text-muted-foreground mt-1 text-gray-500">
            Import and analyze Upwork jobs to generate high-converting
            proposals.
          </p>
        </div>

        {/* Client Component handling the actual POST Request */}
        <ImportJobForm />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-700 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Job Title</th>
              <th className="px-6 py-4 font-medium">Budget</th>
              <th className="px-6 py-4 font-medium">Imported On</th>
              <th className="px-6 py-4 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        No jobs imported
                      </h3>
                      <p className="mt-1 max-w-sm text-sm text-gray-500">
                        You haven&apos;t imported any jobs yet. Paste an Upwork
                        URL to get started.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              result.data.map((job) => {
                let budgetFormatted = 'Unknown';
                if (job.budgetInfo) {
                  budgetFormatted =
                    typeof job.budgetInfo === 'number'
                      ? `$${job.budgetInfo}`
                      : String(job.budgetInfo);
                }

                return (
                  <tr
                    key={job.id}
                    className="border-b transition-colors last:border-0 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  >
                    <td className="max-w-xs truncate px-6 py-4 font-medium">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {budgetFormatted}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:ring-4 focus:ring-zinc-100 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
                      >
                        Analyze{' '}
                        <span className="ml-2 font-normal transition-transform group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
