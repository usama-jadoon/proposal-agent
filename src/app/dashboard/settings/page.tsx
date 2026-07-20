import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/server/db';
import { userSettings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your integrations and agent rules.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
          Upwork Integration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">API Key</label>
            <input
              type="password"
              defaultValue={settings?.upworkApiKey || ''}
              placeholder="••••••••••••••••"
              disabled
              className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm opacity-60 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <p className="mt-1 text-xs text-gray-500">
              Upwork API configuration is handled automatically in this demo
              Phase.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
          Agent Defaults
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Default Hourly Rate ($)
            </label>
            <input
              type="number"
              defaultValue={settings?.defaultHourlyRate || 100}
              className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used during proposal generation strategies.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Timezone / Location string
            </label>
            <input
              type="text"
              defaultValue={settings?.timezone || 'PST'}
              className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
            Save Setting Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
