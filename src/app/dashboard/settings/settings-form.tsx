'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const settingsSchema = z.object({
  openaiKey: z.string().min(1, 'OpenAI API Key is required'),
});

export function SettingsForm({
  initialSettings,
}: {
  initialSettings: { openaiKey: string | null } | null;
}) {
  const [openaiKey, setOpenaiKey] = useState(initialSettings?.openaiKey || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = settingsSchema.safeParse({ openaiKey });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openaiKey }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      toast.success('Settings saved successfully');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl overflow-hidden rounded-xl border bg-white dark:bg-zinc-900">
      <div className="border-b px-6 py-5 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">AI Configuration</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your API keys for the AI orchestrator.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-zinc-100"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            Required for the AiOrchestrator to run analysis.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end border-t pt-4 dark:border-zinc-800">
          <button
            type="submit"
            disabled={loading || !openaiKey}
            className="flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
