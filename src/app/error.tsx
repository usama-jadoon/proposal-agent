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
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
