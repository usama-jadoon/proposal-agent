import { db } from "@/server/db";
import { jobs, jobAnalyses, proposals } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { 
  QualificationAgent, 
  ClientPsychologyAgent, 
  PainAnalysisAgent,
  HookGeneratorAgent,
  SolutionStrategyAgent,
  ProposalWriterAgent,
  QualityReviewAgent
} from "./agents";

/**
 * Orchestrates the sequence of Agents upon a single Job and UserId.
 */
export class AiOrchestrator {
  
  async processJob(userId: string, jobId: string): Promise<void> {
    // 1. Fetch Job from DB
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, userId)));

    if (!job) {
      throw new Error("Job not found or not owned by user");
    }

    const payloadContext = `
      JOB TITLE: ${job.title}
      DESCRIPTION: ${job.description}
      BUDGET INFO: ${JSON.stringify(job.budgetInfo || {})}
      SKILLS: ${JSON.stringify(job.skills || {})}
    `;

    // 2. Instantiate Agents
    const qualificationAgent = new QualificationAgent();
    const psychologyAgent = new ClientPsychologyAgent();
    const painAgent = new PainAnalysisAgent();
    const hookAgent = new HookGeneratorAgent();
    const solutionAgent = new SolutionStrategyAgent();
    const proposalAgent = new ProposalWriterAgent();
    const reviewAgent = new QualityReviewAgent();

    // 3. Serial Sequence (Can be optimized to Promize.all() where independent)
    const qualification = await qualificationAgent.execute(userId, jobId, payloadContext);
    const psychology = await psychologyAgent.execute(userId, jobId, payloadContext);
    const pain = await painAgent.execute(userId, jobId, payloadContext);
    
    // Create the DB Record resolving the analyses Phase
    await db.insert(jobAnalyses).values({
      jobId,
      hiringIntentScore: qualification.hiringIntentScore,
      connectInvestmentScore: qualification.connectInvestmentScore,
      clientReliabilityScore: qualification.clientReliabilityScore,
      hiringProbability: qualification.hiringProbability,
      riskFactors: qualification.riskFactors,
      recommendation: qualification.recommendation,
      psychologyProfile: psychology,
      rootPainAnalysis: pain,
      discoveryQuestions: [], // Will patch in proposal phase
    });

    // Strategy & Writing Generative Output
    const hooks = await hookAgent.execute(userId, jobId, payloadContext);
    const solution = await solutionAgent.execute(userId, jobId, payloadContext);
    
    // Update the existing analyses with the discovery questions
    await db.update(jobAnalyses).set({
      discoveryQuestions: solution.discoveryQuestions
    }).where(eq(jobAnalyses.jobId, jobId));

    // Draft the specific 100-150 string proposal
    const contextWithStrategy = `${payloadContext} \n\n TARGET STRATEGY: ${JSON.stringify(solution)}`;
    const finalDraft = await proposalAgent.execute(userId, jobId, contextWithStrategy);

    // Review grading
    const review = await reviewAgent.execute(userId, jobId, finalDraft.proposal);

    // Save outputs cleanly bounding to UI logic expected by later phases
    await db.insert(proposals).values({
      userId,
      jobId,
      content: finalDraft.proposal,
      status: review.isPassable ? "ready" : "draft",
      hooksGenerated: hooks.hooks,
      ctaGenerated: solution.ctas
    });
  }
}
