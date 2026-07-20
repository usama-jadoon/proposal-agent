'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Job, JobAnalysis, Proposal } from '@/server/db/types';

export function JobDetailClient({
  job,
  analysis,
  proposals,
}: {
  job: Job;
  analysis?: JobAnalysis;
  proposals: Proposal[];
}) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'analysis' | 'proposals'
  >('details');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/analyze`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to trigger analysis');
      }

      toast.success('AI Analysis completed successfully!');
      router.refresh();
      setActiveTab('analysis');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Analysis failed to start.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="max-w-2xl truncate text-3xl font-bold tracking-tight">
            {job.title}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              View on Upwork
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-sm text-zinc-500">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {!analysis && (
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
                AI Thinking...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Run AI Analysis
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex space-x-1 border-b dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('details')}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'details' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
        >
          Job Details
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          disabled={!analysis}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-zinc-300'}`}
        >
          AI Intelligence
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          disabled={proposals.length === 0}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'proposals' ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-zinc-300'}`}
        >
          Generated Proposals
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Original Description
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="font-sans leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {job.description}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && analysis && (
        <div className="animate-in fade-in grid grid-cols-1 gap-6 duration-300 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Client Qualification
            </h3>
            <div className="space-y-6">
              <div className="rounded-lg border bg-zinc-50 p-4 dark:border-zinc-800/80 dark:bg-zinc-800/50">
                <span className="mb-1 block text-sm font-medium tracking-wider text-zinc-500 uppercase">
                  Hiring Probability
                </span>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {analysis.hiringProbability}%
                  </div>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={`h-full rounded-full ${analysis.hiringProbability && analysis.hiringProbability > 70 ? 'bg-green-500' : analysis.hiringProbability && analysis.hiringProbability > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${analysis.hiringProbability || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium tracking-wider text-zinc-500 uppercase">
                  AI Recommendation
                </span>
                <div
                  className={`rounded-lg border p-4 font-medium ${
                    analysis.recommendation?.toLowerCase().includes('skip')
                      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400'
                      : analysis.recommendation
                            ?.toLowerCase()
                            .includes('only if')
                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400'
                        : 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400'
                  }`}
                >
                  <div className="flex gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{analysis.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Psychology Profile
            </h3>
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              <pre className="max-h-[300px] overflow-auto rounded-lg border bg-zinc-50 p-4 font-mono text-xs whitespace-pre-wrap dark:border-zinc-700/50 dark:bg-zinc-800/80">
                {JSON.stringify(analysis.psychologyProfile, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'proposals' && proposals.length > 0 && (
        <div className="animate-in fade-in space-y-6 duration-300">
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recommended Proposal
              </h3>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${proposals[0].status === 'ready' ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400' : 'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-900/30 dark:text-yellow-400'}`}
              >
                {proposals[0].status.toUpperCase()}
              </span>
            </div>
            <div className="p-6">
              <div className="relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(proposals[0].content || '');
                    toast.success('Copied to clipboard');
                  }}
                  className="absolute top-2 right-2 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                  title="Copy to clipboard"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <p className="pr-10 font-sans text-sm leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                  {proposals[0].content}
                </p>
              </div>
            </div>
          </div>

          {(proposals[0].hooksGenerated as string[])?.length > 0 && (
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Alternative Opening Hooks
              </h4>
              <ul className="space-y-3">
                {(proposals[0].hooksGenerated as string[]).map((hook, i) => (
                  <li
                    key={i}
                    className="group flex gap-3 rounded-lg border bg-zinc-50 p-3 text-sm transition-colors hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                      {hook}
                    </span>
                    <button
                      onClick={() => {
                        const proposalText = proposals[0].content || '';
                        const parts = proposalText.split('\n\n');
                        const newText = [hook, ...parts.slice(1)].join('\n\n');
                        navigator.clipboard.writeText(newText);
                        toast.success('Hook + Proposal copied to clipboard');
                      }}
                      className="ml-auto p-1.5 text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:text-zinc-800 dark:hover:text-zinc-200"
                      title="Copy this hook with the rest of the proposal"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
