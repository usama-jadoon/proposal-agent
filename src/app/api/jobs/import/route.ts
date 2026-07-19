import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { importJobSchema } from "@/server/services/jobs/job-validator";
import { JobService } from "@/server/services/jobs/job-service";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    
    // Validate request using Zod
    const validationResult = importJobSchema.safeParse(payload);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const jobService = new JobService();
    
    try {
      const result = await jobService.ingestJob(session.user.id, validationResult.data);
      
      return NextResponse.json(
        { 
          message: result.isDuplicate ? "Job already imported" : "Job imported successfully",
          job: result.job,
          status: result.isDuplicate ? "duplicate" : "created"
        },
        { status: result.isDuplicate ? 200 : 201 }
      );
    } catch (serviceError) {
      return NextResponse.json(
        { error: serviceError instanceof Error ? serviceError.message : "Service processing failed" },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Job Import Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
