'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className:
          'bg-white border border-gray-200 text-gray-900 shadow-lg font-sans',
        style: { fontFamily: 'var(--font-geist-sans)' },
      }}
    />
  );
}
