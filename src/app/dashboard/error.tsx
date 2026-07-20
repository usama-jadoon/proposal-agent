'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error using our logger context locally
    console.error('Dashboard caught error:', error);
  }, [error]);

  return (
    <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center overflow-hidden rounded-xl border bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-8 max-w-md text-zinc-500">
        An unexpected error occurred while loading this section of the
        dashboard.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => (window.location.href = '/dashboard')}
          className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Go Back Home
        </button>
        <button
          onClick={() => reset()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Try Again
        </button>
      </div>

      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 w-full overflow-auto rounded-lg bg-zinc-50 p-4 text-left font-mono text-xs text-red-500 dark:bg-zinc-950">
          <p className="mb-1 font-bold">Developer Error Details:</p>
          {error.message}
        </div>
      )}
    </div>
  );
}
