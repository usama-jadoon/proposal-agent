import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { JobRepository } from "@/server/repositories/job-repository";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Await params as required by Next.js 15
    const resolvedParams = await params;

    const repository = new JobRepository();
    const job = await repository.findByIdAndUserId(resolvedParams.id, session.user.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job Detail Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Revert to 500
    );
  }
}
