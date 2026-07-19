# Proposal Agent — TODO

> Prioritized task list. Check off items as completed.
> Priority: 🔴 Critical | 🟡 Important | 🟢 Nice-to-have

---

## Phase 1: Foundation

- [ ] 🔴 Initialize Next.js 15 project with TypeScript strict mode
- [ ] 🔴 Configure Tailwind CSS 4
- [ ] 🔴 Install and configure shadcn/ui (`components.json` + base primitives)
- [ ] 🔴 Create `docker-compose.yml` (Next.js app + PostgreSQL 16 + pgAdmin)
- [ ] 🔴 Create `Dockerfile.dev` with hot reload
- [ ] 🔴 Create multi-stage production `Dockerfile`
- [ ] 🔴 Setup Drizzle ORM (`drizzle.config.ts`, client instance)
- [ ] 🔴 Setup environment variables (`.env.example`, `.env.local`)
- [ ] 🔴 Configure ESLint + Prettier
- [ ] 🔴 Configure Vitest
- [ ] 🔴 Setup path aliases in `tsconfig.json` (`@/` prefix)
- [ ] 🔴 Create root layout with font loading and metadata
- [ ] 🔴 Create global error boundary (`error.tsx`)
- [ ] 🔴 Create not-found page (`not-found.tsx`)
- [ ] 🔴 Create loading fallback (`loading.tsx`)
- [ ] 🟡 Create `README.md` with setup instructions
- [ ] 🟡 Setup `.gitignore`

## Phase 2: Authentication

- [ ] 🔴 Install and configure NextAuth v5 (Auth.js)
- [ ] 🔴 Create `users` table schema (Drizzle)
- [ ] 🔴 Create `user_settings` table schema
- [ ] 🔴 Implement credentials provider (email + password)
- [ ] 🔴 Create login page (`/login`)
- [ ] 🔴 Create registration page (`/register`)
- [ ] 🔴 Create auth layout (minimal, centered)
- [ ] 🔴 Implement auth middleware (protect `/dashboard/*` routes)
- [ ] 🔴 Create auth guard utilities (`requireAuth`, `getCurrentUser`)
- [ ] 🟡 Add Google OAuth provider
- [ ] 🟡 Add GitHub OAuth provider
- [ ] 🟢 Email verification flow
- [ ] 🟢 Password reset flow

## Phase 3: Dashboard Shell

- [ ] 🔴 Create dashboard layout with sidebar + header
- [ ] 🔴 Build sidebar component (collapsible, navigation links)
- [ ] 🔴 Build header component (user menu, breadcrumbs)
- [ ] 🔴 Build mobile navigation (sheet-based)
- [ ] 🔴 Create dashboard home page with placeholder stats
- [ ] 🟡 Implement theme toggle (light/dark)
- [ ] 🟡 Create breadcrumb system with route-based auto generation
- [ ] 🟢 Keyboard shortcuts (⌘K command palette)

## Phase 4: Database Schema & Data Layer

- [ ] 🔴 Create `jobs` table schema
- [ ] 🔴 Create `job_analyses` table schema
- [ ] 🔴 Create `proposals` table schema
- [ ] 🔴 Create `proposal_templates` table schema
- [ ] 🔴 Create `agent_runs` table schema
- [ ] 🔴 Run initial migration
- [ ] 🔴 Create seed script with sample data
- [ ] 🔴 Implement `UserRepository` (CRUD)
- [ ] 🔴 Implement `JobRepository` (CRUD + filtering)
- [ ] 🔴 Implement `ProposalRepository` (CRUD + filtering + pagination)
- [ ] 🔴 Implement `TemplateRepository` (CRUD)
- [ ] 🔴 Implement `AgentRunRepository` (create + query)
- [ ] 🔴 Implement `SettingsRepository` (get + upsert)

## Phase 5: API Layer

- [ ] 🔴 Create standardized API response utility (`success()`, `error()`, `paginated()`)
- [ ] 🔴 Create custom error classes (`NotFoundError`, `ValidationError`, `UnauthorizedError`)
- [ ] 🔴 Create Zod validation schemas (proposal, job, user, template)
- [ ] 🔴 `GET /api/health` — health check
- [ ] 🔴 `GET /api/proposals` — list proposals (paginated, filtered)
- [ ] 🔴 `POST /api/proposals` — create proposal
- [ ] 🔴 `GET /api/proposals/:id` — get single proposal
- [ ] 🔴 `PUT /api/proposals/:id` — update proposal
- [ ] 🔴 `DELETE /api/proposals/:id` — delete proposal
- [ ] 🔴 `GET /api/jobs` — list analyzed jobs
- [ ] 🔴 `POST /api/jobs` — submit job for analysis
- [ ] 🔴 `GET /api/jobs/:id` — get job analysis
- [ ] 🔴 `DELETE /api/jobs/:id` — delete job
- [ ] 🔴 `POST /api/jobs/qualify` — run qualification only
- [ ] 🔴 `GET /api/templates` — list templates
- [ ] 🔴 `POST /api/templates` — create template
- [ ] 🔴 `PUT /api/templates/:id` — update template
- [ ] 🔴 `DELETE /api/templates/:id` — delete template
- [ ] 🔴 `GET /api/user/profile` — get profile
- [ ] 🔴 `PUT /api/user/profile` — update profile
- [ ] 🔴 `GET /api/user/settings` — get settings
- [ ] 🔴 `PUT /api/user/settings` — update settings
- [ ] 🟡 `GET /api/user/usage` — token usage stats
- [ ] 🟡 `GET /api/agents` — list available agents
- [ ] 🟡 `POST /api/agents/run` — run single agent
- [ ] 🟡 `GET /api/agents/runs` — list agent run history
- [ ] 🟡 Rate limiting middleware

## Phase 6: AI Agent System

- [ ] 🔴 Create OmniRoute API client (`omniroute-client.ts`)
- [ ] 🔴 Implement prompt builder utility
- [ ] 🔴 Implement structured response parser (Zod-validated)
- [ ] 🔴 Create `BaseAgent` abstract class
- [ ] 🔴 Create `AgentRegistry` (register, lookup, list)
- [ ] 🔴 Create `AgentPipeline` (sequential execution with data passing)
- [ ] 🔴 Implement **Qualification Agent** with system prompt
- [ ] 🔴 Implement **Client Psychology Agent** with system prompt
- [ ] 🔴 Implement **Pain Analysis Agent** with system prompt
- [ ] 🔴 Implement **Hook Generation Agent** with system prompt
- [ ] 🔴 Implement **Solution Strategy Agent** with system prompt
- [ ] 🔴 Implement **Proposal Writer Agent** with system prompt
- [ ] 🔴 Implement **Quality Reviewer Agent** with system prompt + scoring rubric
- [ ] 🔴 Implement quality gate logic (score < 7 → re-run writer with feedback)
- [ ] 🔴 Create `AgentOrchestrator` service (full pipeline execution)
- [ ] 🔴 Token usage tracking per agent run
- [ ] 🟡 Agent run logging to database
- [ ] 🟡 Retry logic with exponential backoff
- [ ] 🟡 Parallel execution for independent agents (psychology + pain analysis)
- [ ] 🟢 Agent output caching (avoid re-running on same input)

## Phase 7: Proposal Generation Flow

- [ ] 🔴 Create job input form (paste text or URL)
- [ ] 🔴 `POST /api/proposals/generate` — trigger full pipeline
- [ ] 🔴 SSE streaming endpoint for real-time progress updates
- [ ] 🔴 Create `useGeneration` hook (EventSource consumer)
- [ ] 🔴 Build generation progress UI (step-by-step with status indicators)
- [ ] 🔴 Build qualification results display (scores, radar chart, recommendation)
- [ ] 🔴 Build hook selector UI (pick from 5 generated hooks)
- [ ] 🔴 Build proposal editor (edit AI output before finalizing)
- [ ] 🔴 Build proposal preview panel
- [ ] 🔴 Build discovery questions display
- [ ] 🔴 Build CTA selector
- [ ] 🟡 Copy-to-clipboard button
- [ ] 🟡 Export proposal as plain text / markdown
- [ ] 🟡 Regenerate individual sections
- [ ] 🟢 Version history (compare revisions)

## Phase 8: Pages & UI

- [ ] 🔴 Landing page (marketing / hero / features / CTA)
- [ ] 🔴 Proposals list page (cards, filters, search)
- [ ] 🔴 Proposal detail page (full view with all sections)
- [ ] 🔴 New proposal page (wizard-style flow)
- [ ] 🔴 Jobs list page (analyzed jobs with scores)
- [ ] 🔴 Job detail page (full analysis)
- [ ] 🔴 Templates page (CRUD)
- [ ] 🔴 Settings page (model preferences, API key, defaults)
- [ ] 🔴 Profile page (skills, bio, portfolio URLs)
- [ ] 🟡 History page (all generation runs)
- [ ] 🟡 Empty states for all list pages
- [ ] 🟡 Loading skeletons for all pages
- [ ] 🟡 Responsive design pass (mobile, tablet, desktop)
- [ ] 🟢 Onboarding flow for new users

## Phase 9: Testing

- [ ] 🔴 Unit tests — `ProposalService`
- [ ] 🔴 Unit tests — `JobAnalysisService`
- [ ] 🔴 Unit tests — `AgentOrchestrator`
- [ ] 🔴 Unit tests — all Zod validation schemas
- [ ] 🔴 Unit tests — `BaseAgent` and each agent implementation
- [ ] 🟡 Integration tests — all API routes
- [ ] 🟡 Integration tests — database repository functions
- [ ] 🟡 E2E test — full proposal generation flow
- [ ] 🟡 E2E test — authentication flow
- [ ] 🟢 E2E test — template CRUD
- [ ] 🟢 Test coverage report in CI

## Phase 10: Production Hardening

- [ ] 🔴 Rate limiting on all API routes
- [ ] 🔴 Input sanitization (XSS prevention)
- [ ] 🔴 API key encryption at rest
- [ ] 🔴 CORS configuration
- [ ] 🔴 Security headers (CSP, HSTS, X-Frame-Options)
- [ ] 🔴 Structured logging with request IDs
- [ ] 🟡 CI pipeline (lint → type-check → test → build)
- [ ] 🟡 CD pipeline (auto-deploy on merge to main)
- [ ] 🟡 Database migration in CI/CD
- [ ] 🟡 Production deployment guide in `docs/`
- [ ] 🟢 Performance monitoring setup
- [ ] 🟢 Error tracking (Sentry or similar)

## Phase 11: Future Enhancements

- [ ] 🟢 Upwork URL auto-parsing (extract job + client data)
- [ ] 🟢 Proposal A/B testing (multiple variants)
- [ ] 🟢 Win/loss tracking with feedback loop to improve agents
- [ ] 🟢 Team accounts (multi-user organizations)
- [ ] 🟢 Bulk job analysis (batch mode)
- [ ] 🟢 Chrome extension (analyze from Upwork page)
- [ ] 🟢 Analytics dashboard (conversion rates, best hooks, etc.)
- [ ] 🟢 Webhook integrations (Slack, email notifications)
- [ ] 🟢 Multi-language proposal generation
- [ ] 🟢 Custom agent creation (user-defined agents)
- [ ] 🟢 Stripe billing integration
- [ ] 🟢 Usage-based pricing with token metering

---

## Progress Tracker

| Phase | Tasks | Completed | Progress |
|---|---|---|---|
| 1. Foundation | 16 | 0 | ░░░░░░░░░░ 0% |
| 2. Authentication | 12 | 0 | ░░░░░░░░░░ 0% |
| 3. Dashboard Shell | 8 | 0 | ░░░░░░░░░░ 0% |
| 4. Data Layer | 12 | 0 | ░░░░░░░░░░ 0% |
| 5. API Layer | 24 | 0 | ░░░░░░░░░░ 0% |
| 6. AI Agents | 19 | 0 | ░░░░░░░░░░ 0% |
| 7. Generation Flow | 14 | 0 | ░░░░░░░░░░ 0% |
| 8. Pages & UI | 14 | 0 | ░░░░░░░░░░ 0% |
| 9. Testing | 11 | 0 | ░░░░░░░░░░ 0% |
| 10. Production | 12 | 0 | ░░░░░░░░░░ 0% |
| 11. Future | 12 | 0 | ░░░░░░░░░░ 0% |
| **Total** | **154** | **0** | ░░░░░░░░░░ **0%** |
