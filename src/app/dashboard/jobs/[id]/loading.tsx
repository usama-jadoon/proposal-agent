export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="mb-4 flex gap-4">
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-zinc-800"></div>
      </div>

      <div className="rounded-xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-start justify-between">
          <div className="w-1/2 space-y-3">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-zinc-800"></div>
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-zinc-800"></div>
          </div>
          <div className="h-10 w-32 rounded bg-gray-200 dark:bg-zinc-800"></div>
        </div>

        <div className="mt-8 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-zinc-800"></div>
        </div>
      </div>
    </div>
  );
}
