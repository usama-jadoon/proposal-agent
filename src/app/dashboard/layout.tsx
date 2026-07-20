import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-white md:block dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Proposal Agent</h2>
        </div>
        <nav className="space-y-1 px-4">
          <Link
            href="/dashboard"
            className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/jobs"
            className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            Job Pipeline
          </Link>
          <Link
            href="/dashboard/settings"
            className="block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 shrink-0 items-center justify-end border-b bg-white p-4 md:justify-between dark:border-zinc-800 dark:bg-zinc-900">
          <div className="font-bold md:hidden">Proposal Agent</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{session.user.name}</span>
            <form action="/api/auth/signout" method="POST">
              <button className="rounded-md bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40">
                Sign Out
              </button>
            </form>
          </div>
        </header>
        <div className="mx-auto max-w-6xl p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
