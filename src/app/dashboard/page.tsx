import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { userSettings } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Sign Out
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl shadow-sm bg-card">
          <h2 className="text-xl font-semibold mb-2">Upwork Agent Control</h2>
          <p className="text-sm text-gray-500 mb-4">You have connected your Upwork and OpenAI credentials.</p>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${settings?.upworkApiKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm font-medium">{settings?.upworkApiKey ? 'Upwork Connected' : 'Upwork Missing'}</span>
          </div>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-card">
          <h2 className="text-xl font-semibold mb-2">Proposal System</h2>
          <p className="text-sm text-gray-500">Analytics and AI generation status.</p>
          <div className="mt-4 text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Proposals Generated</p>
        </div>
      </div>
    </div>
  );
}
