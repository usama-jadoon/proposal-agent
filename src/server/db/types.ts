import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as schema from "./schema";

// Users
export type User = InferSelectModel<typeof schema.user>;
export type NewUser = InferInsertModel<typeof schema.user>;

// User Settings 
export type UserSettings = InferSelectModel<typeof schema.userSettings>;
export type NewUserSettings = InferInsertModel<typeof schema.userSettings>;

// Jobs
export type Job = InferSelectModel<typeof schema.jobs>;
export type NewJob = InferInsertModel<typeof schema.jobs>;

// Job Analyses
export type JobAnalysis = InferSelectModel<typeof schema.jobAnalyses>;
export type NewJobAnalysis = InferInsertModel<typeof schema.jobAnalyses>;

// Proposal Templates
export type ProposalTemplate = InferSelectModel<typeof schema.proposalTemplates>;
export type NewProposalTemplate = InferInsertModel<typeof schema.proposalTemplates>;

// Proposals
export type Proposal = InferSelectModel<typeof schema.proposals>;
export type NewProposal = InferInsertModel<typeof schema.proposals>;

// Agent Runs
export type AgentRun = InferSelectModel<typeof schema.agentRuns>;
export type NewAgentRun = InferInsertModel<typeof schema.agentRuns>;
