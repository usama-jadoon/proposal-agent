import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

// ================= Better Auth Required Tables =================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),

  // Custom fields
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionStatus: text('subscription_status'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

// ================= Application Tables =================

// User Settings Table
export const userSettings = pgTable('user_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  upworkApiKey: text('upwork_api_key'),
  openAiApiKey: text('openai_api_key'),
  defaultHourlyRate: integer('default_hourly_rate'),
  timezone: text('timezone'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Jobs Table (Scraped/Imported jobs from Upwork)
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  upworkJobId: text('upwork_job_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  clientInfo: jsonb('client_info'), // Store client stats, location, history
  budgetInfo: jsonb('budget_info'), // Fixed price or hourly range
  skills: jsonb('skills'), // Array of required skills
  url: text('url').notNull(),
  postedAt: timestamp('posted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Job Analyses Table (Agent insight output)
export const jobAnalyses = pgTable('job_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  hiringIntentScore: integer('hiring_intent_score'), // 1-10
  connectInvestmentScore: integer('connect_investment_score'), // 1-10
  clientReliabilityScore: integer('client_reliability_score'), // 1-10
  hiringProbability: integer('hiring_probability'), // Percentage 0-100
  riskFactors: jsonb('risk_factors'), // Array of risks
  recommendation: text('recommendation'), // Apply Immediately, Apply Only If Strong Advantage, Skip
  psychologyProfile: jsonb('psychology_profile'), // Fears, needs, triggers
  rootPainAnalysis: jsonb('root_pain_analysis'),
  discoveryQuestions: jsonb('discovery_questions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Proposal Templates Table
export const proposalTemplates = pgTable('proposal_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  content: text('content').notNull(),
  category: text('category'), // e.g. "React Migration", "Data Architect"
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Proposals Table
export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  status: text('status').notNull().default('draft'), // draft, ready, submitted, accepted, rejected
  hooksGenerated: jsonb('hooks_generated'), // Array of opening hooks considered
  ctaGenerated: jsonb('cta_generated'), // Array of CTAs considered
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Agent Runs Table
export const agentRuns = pgTable('agent_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('running'), // pending, running, completed, failed
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// ================= Relations =================

// User Relations
export const userRelations = relations(user, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [user.id],
    references: [userSettings.userId],
  }),
  jobs: many(jobs),
  templates: many(proposalTemplates),
  proposals: many(proposals),
  agentRuns: many(agentRuns),
}));

// User Settings Relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}));

// Job Relations
export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(user, {
    fields: [jobs.userId],
    references: [user.id],
  }),
  analysis: one(jobAnalyses, {
    fields: [jobs.id],
    references: [jobAnalyses.jobId],
  }),
  proposals: many(proposals),
  agentRuns: many(agentRuns),
}));

// Job Analysis Relations
export const jobAnalysesRelations = relations(jobAnalyses, ({ one }) => ({
  job: one(jobs, {
    fields: [jobAnalyses.jobId],
    references: [jobs.id],
  }),
}));

// Proposal Template Relations
export const proposalTemplatesRelations = relations(
  proposalTemplates,
  ({ one }) => ({
    user: one(user, {
      fields: [proposalTemplates.userId],
      references: [user.id],
    }),
  }),
);

// Proposal Relations
export const proposalsRelations = relations(proposals, ({ one }) => ({
  user: one(user, {
    fields: [proposals.userId],
    references: [user.id],
  }),
  job: one(jobs, {
    fields: [proposals.jobId],
    references: [jobs.id],
  }),
}));

// Agent Runs Relations
export const agentRunsRelations = relations(agentRuns, ({ one }) => ({
  user: one(user, {
    fields: [agentRuns.userId],
    references: [user.id],
  }),
  job: one(jobs, {
    fields: [agentRuns.jobId],
    references: [jobs.id],
  }),
}));
