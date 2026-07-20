import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/server/db';
import { userSettings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor your pipeline and connected systems.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Upwork Agent Control</h2>
          <p className="mb-4 text-sm text-gray-500">
            You have connected your Upwork and OpenAI credentials.
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${settings?.upworkApiKey ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
            <span className="text-sm font-medium">
              {settings?.upworkApiKey ? 'Upwork Connected' : 'Upwork Missing'}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Proposal System</h2>
          <p className="text-sm text-gray-500">
            Analytics and AI generation status.
          </p>
          <div className="mt-4 text-2xl font-bold">0</div>
          <p className="text-muted-foreground text-xs">Proposals Generated</p>
        </div>
      </div>
    </div>
  );
}
