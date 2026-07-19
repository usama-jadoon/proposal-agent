'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
