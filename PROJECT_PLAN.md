# Proposal Agent — Project Plan

## 1. Vision

An AI-powered SaaS platform that helps freelancers win more clients on Upwork by analyzing job posts, qualifying opportunities, profiling clients, and generating high-conversion proposals — all powered by a multi-agent AI pipeline.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Language | TypeScript 5.x (strict mode) |
| Database | PostgreSQL 16 |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 (Auth.js) |
| AI Gateway | OmniRoute |
| State | Zustand |
| Validation | Zod |
| API | Next.js Route Handlers + Server Actions |
| Testing | Vitest, Playwright |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Monorepo | Turborepo (future consideration) |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│  Next.js App Router — React 19 — shadcn/ui — Tailwind   │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│                    NEXT.JS SERVER                         │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Route        │  │ Server       │  │ Middleware      │  │
│  │ Handlers     │  │ Actions      │  │ (Auth/Rate)     │  │
│  │ /api/*       │  │              │  │                 │  │
│  └──────┬──────┘  └──────┬───────┘  └────────────────┘  │
│         │                │                               │
│  ┌──────▼────────────────▼───────┐                       │
│  │       SERVICE LAYER           │                       │
│  │  ProposalService              │                       │
│  │  JobAnalysisService           │                       │
│  │  ClientIntelService           │                       │
│  │  AgentOrchestrator            │                       │
│  └──────────────┬────────────────┘                       │
│                 │                                        │
│  ┌──────────────▼────────────────┐                       │
│  │       REPOSITORY LAYER        │                       │
│  │  Drizzle ORM → PostgreSQL     │                       │
│  └──────────────┬────────────────┘                       │
│                 │                                        │
└─────────────────┼────────────────────────────────────────┘
                  │
    ┌─────────────▼──────────────┐
    │       EXTERNAL SERVICES     │
    │  ┌───────────────────────┐ │
    │  │  OmniRoute AI Gateway │ │
    │  │  (Claude/GPT/Gemini)  │ │
    │  └───────────────────────┘ │
    │  ┌───────────────────────┐ │
    │  │  PostgreSQL 16        │ │
    │  └───────────────────────┘ │
    └────────────────────────────┘
```

### Layered Architecture

1. **Presentation Layer** — React components, pages, layouts
2. **API Layer** — Route handlers, server actions, middleware
3. **Service Layer** — Business logic, agent orchestration
4. **Repository Layer** — Data access via Drizzle ORM
5. **Infrastructure Layer** — Database, AI providers, external APIs

---

## 4. Folder Structure

```
proposal-agent/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint, type-check, test on PR
│   │   ├── cd.yml                    # Build & deploy on merge to main
│   │   └── db-migrate.yml            # Run migrations on deploy
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker/
│   ├── Dockerfile                    # Multi-stage production build
│   ├── Dockerfile.dev                # Dev container with hot reload
│   └── docker-compose.yml            # App + Postgres + pgAdmin
│
├── docs/
│   ├── architecture.md               # This architecture doc
│   ├── api-reference.md              # Full API documentation
│   ├── database-schema.md            # ERD and schema docs
│   ├── ai-agents.md                  # Agent definitions and flows
│   ├── deployment.md                 # Deployment guide
│   └── contributing.md               # Contribution guidelines
│
├── scripts/
│   ├── seed.ts                       # Database seed data
│   ├── migrate.ts                    # Migration runner
│   └── generate-types.ts             # Type generation helpers
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group (no layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Minimal auth layout
│   │   │
│   │   ├── (dashboard)/              # Authenticated route group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Overview & stats
│   │   │   ├── proposals/
│   │   │   │   ├── page.tsx          # Proposal list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # New proposal wizard
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # View/edit proposal
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx          # Analyzed jobs list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Job analysis detail
│   │   │   ├── templates/
│   │   │   │   └── page.tsx          # Proposal templates
│   │   │   ├── history/
│   │   │   │   └── page.tsx          # Generation history
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # User settings & API keys
│   │   │   └── layout.tsx            # Dashboard shell (sidebar, header)
│   │   │
│   │   ├── api/                      # API Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts      # NextAuth catch-all
│   │   │   ├── proposals/
│   │   │   │   ├── route.ts          # GET list, POST create
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts      # GET, PUT, DELETE single
│   │   │   │   └── generate/
│   │   │   │       └── route.ts      # POST — trigger AI generation
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts          # GET list, POST analyze
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts      # GET single analysis
│   │   │   │   └── qualify/
│   │   │   │       └── route.ts      # POST — run qualification
│   │   │   ├── agents/
│   │   │   │   ├── route.ts          # GET available agents
│   │   │   │   └── run/
│   │   │   │       └── route.ts      # POST — run specific agent
│   │   │   ├── templates/
│   │   │   │   └── route.ts          # CRUD templates
│   │   │   ├── user/
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts      # GET, PUT profile
│   │   │   │   └── settings/
│   │   │   │       └── route.ts      # GET, PUT settings
│   │   │   └── health/
│   │   │       └── route.ts          # Health check
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── loading.tsx               # Global loading
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── not-found.tsx             # 404 page
│   │   └── globals.css               # Tailwind base styles
│   │
│   ├── components/                   # React Components
│   │   ├── ui/                       # shadcn/ui primitives (button, card, etc.)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── proposals/
│   │   │   ├── proposal-card.tsx
│   │   │   ├── proposal-editor.tsx
│   │   │   ├── proposal-preview.tsx
│   │   │   ├── generation-progress.tsx
│   │   │   └── qualification-badge.tsx
│   │   ├── jobs/
│   │   │   ├── job-input-form.tsx
│   │   │   ├── job-analysis-card.tsx
│   │   │   ├── client-intel-panel.tsx
│   │   │   └── scoring-radar.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-proposals.tsx
│   │   │   └── success-rate-chart.tsx
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── confirm-dialog.tsx
│   │       └── empty-state.tsx
│   │
│   ├── lib/                          # Core Library Code
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client instance
│   │   │   ├── schema/
│   │   │   │   ├── index.ts          # Re-export all schemas
│   │   │   │   ├── users.ts          # Users table
│   │   │   │   ├── proposals.ts      # Proposals table
│   │   │   │   ├── jobs.ts           # Job analyses table
│   │   │   │   ├── templates.ts      # Proposal templates
│   │   │   │   ├── agent-runs.ts     # Agent execution logs
│   │   │   │   └── settings.ts       # User settings
│   │   │   └── migrations/           # Drizzle migration files
│   │   │
│   │   ├── services/
│   │   │   ├── proposal.service.ts   # Proposal CRUD + generation
│   │   │   ├── job-analysis.service.ts
│   │   │   ├── client-intel.service.ts
│   │   │   ├── template.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── agent-orchestrator.service.ts
│   │   │
│   │   ├── agents/                   # AI Agent Definitions
│   │   │   ├── base-agent.ts         # Abstract base agent class
│   │   │   ├── agent-registry.ts     # Agent registration & lookup
│   │   │   ├── agent-pipeline.ts     # Sequential/parallel orchestration
│   │   │   ├── qualification/
│   │   │   │   └── qualification-agent.ts
│   │   │   ├── client-psychology/
│   │   │   │   └── client-psychology-agent.ts
│   │   │   ├── pain-analysis/
│   │   │   │   └── pain-analysis-agent.ts
│   │   │   ├── hook-generation/
│   │   │   │   └── hook-generation-agent.ts
│   │   │   ├── solution-strategy/
│   │   │   │   └── solution-strategy-agent.ts
│   │   │   ├── proposal-writer/
│   │   │   │   └── proposal-writer-agent.ts
│   │   │   └── quality-reviewer/
│   │   │       └── quality-reviewer-agent.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── omniroute-client.ts   # OmniRoute API wrapper
│   │   │   ├── prompt-builder.ts     # Dynamic prompt construction
│   │   │   ├── response-parser.ts    # Structured output parsing
│   │   │   └── token-tracker.ts      # Usage tracking
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.config.ts        # NextAuth configuration
│   │   │   ├── auth.ts               # Auth helpers & session
│   │   │   └── guards.ts            # Route protection utilities
│   │   │
│   │   ├── validators/
│   │   │   ├── proposal.schema.ts    # Zod schemas for proposals
│   │   │   ├── job.schema.ts         # Zod schemas for jobs
│   │   │   ├── user.schema.ts
│   │   │   └── common.schema.ts      # Shared validation schemas
│   │   │
│   │   └── utils/
│   │       ├── api-response.ts       # Standardized API responses
│   │       ├── errors.ts             # Custom error classes
│   │       ├── logger.ts             # Structured logging
│   │       ├── rate-limiter.ts       # API rate limiting
│   │       └── constants.ts          # App-wide constants
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── use-proposals.ts
│   │   ├── use-job-analysis.ts
│   │   ├── use-generation.ts         # SSE streaming hook
│   │   └── use-auth.ts
│   │
│   ├── stores/                       # Zustand Stores
│   │   ├── proposal-store.ts
│   │   ├── job-store.ts
│   │   └── ui-store.ts               # Sidebar, theme, modals
│   │
│   ├── types/                        # TypeScript Type Definitions
│   │   ├── proposal.types.ts
│   │   ├── job.types.ts
│   │   ├── agent.types.ts
│   │   ├── api.types.ts
│   │   └── database.types.ts         # Drizzle inferred types
│   │
│   └── config/
│       ├── site.ts                   # Site metadata
│       ├── nav.ts                    # Navigation config
│       └── agents.ts                 # Agent configuration
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── agents/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── proposals.spec.ts
│
├── .env.example                      # Environment variable template
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── drizzle.config.ts                 # Drizzle Kit configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── components.json                   # shadcn/ui config
├── package.json
├── TODO.md
├── PROJECT_PLAN.md
└── README.md
```

### Folder Explanations

| Folder | Purpose |
|---|---|
| `.github/` | CI/CD workflows, PR templates |
| `docker/` | Containerization for dev and production |
| `docs/` | Living documentation — architecture, API, deployment |
| `scripts/` | CLI utilities for seeding, migrations, codegen |
| `src/app/(auth)/` | Public authentication pages (login, register) |
| `src/app/(dashboard)/` | Protected pages behind auth |
| `src/app/api/` | REST API route handlers |
| `src/components/ui/` | shadcn/ui primitives — never modified manually |
| `src/components/layout/` | Shell components — sidebar, header, nav |
| `src/components/proposals/` | Domain-specific proposal UI components |
| `src/components/jobs/` | Job analysis and qualification UI |
| `src/components/dashboard/` | Dashboard widgets and charts |
| `src/components/shared/` | Reusable generic components |
| `src/lib/db/` | Database client, schemas, migrations |
| `src/lib/services/` | Business logic — one service per domain |
| `src/lib/agents/` | AI agent definitions and orchestration |
| `src/lib/ai/` | OmniRoute client, prompt building, parsing |
| `src/lib/auth/` | Authentication config and helpers |
| `src/lib/validators/` | Zod schemas for request validation |
| `src/lib/utils/` | Cross-cutting utilities |
| `src/hooks/` | Custom React hooks for data fetching |
| `src/stores/` | Zustand state management |
| `src/types/` | Shared TypeScript type definitions |
| `src/config/` | Application configuration constants |
| `tests/` | Unit, integration, and E2E tests |

---

## 5. API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET`  | `/api/auth/session` | Current session |

### Proposals
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/proposals` | List user's proposals (paginated) |
| `POST` | `/api/proposals` | Create proposal (manual) |
| `GET` | `/api/proposals/:id` | Get single proposal |
| `PUT` | `/api/proposals/:id` | Update proposal |
| `DELETE` | `/api/proposals/:id` | Delete proposal |
| `POST` | `/api/proposals/generate` | Trigger full AI generation pipeline |
| `GET` | `/api/proposals/generate/:id/stream` | SSE stream for generation progress |

### Job Analysis
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | List analyzed jobs |
| `POST` | `/api/jobs` | Submit job URL/text for analysis |
| `GET` | `/api/jobs/:id` | Get full analysis |
| `POST` | `/api/jobs/qualify` | Run qualification scoring only |
| `DELETE` | `/api/jobs/:id` | Delete analysis |

### AI Agents
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/agents` | List available agents |
| `POST` | `/api/agents/run` | Run a single agent independently |
| `GET` | `/api/agents/runs` | List past agent runs |
| `GET` | `/api/agents/runs/:id` | Get single agent run result |

### Templates
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/templates` | List templates |
| `POST` | `/api/templates` | Create template |
| `PUT` | `/api/templates/:id` | Update template |
| `DELETE` | `/api/templates/:id` | Delete template |

### User
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/profile` | Get profile |
| `PUT` | `/api/user/profile` | Update profile (skills, bio, portfolio) |
| `GET` | `/api/user/settings` | Get settings |
| `PUT` | `/api/user/settings` | Update settings (AI prefs, defaults) |
| `GET` | `/api/user/usage` | Token usage & billing stats |

### System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |

---

## 6. Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, default gen |
| `email` | `varchar(255)` | Unique, not null |
| `name` | `varchar(255)` | |
| `password_hash` | `text` | Bcrypt |
| `avatar_url` | `text` | |
| `bio` | `text` | Freelancer bio for context |
| `skills` | `jsonb` | Array of skill strings |
| `portfolio_urls` | `jsonb` | Array of URLs |
| `upwork_profile_url` | `text` | |
| `created_at` | `timestamp` | Default now |
| `updated_at` | `timestamp` | Auto-update |

### `user_settings`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users, unique |
| `default_model` | `varchar(100)` | OmniRoute model ID |
| `default_tone` | `varchar(50)` | professional/conversational/bold |
| `proposal_length` | `varchar(20)` | short/medium/long |
| `auto_qualify` | `boolean` | Default true |
| `qualification_threshold` | `integer` | Min score to recommend (1-10) |
| `omniroute_api_key` | `text` | Encrypted |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

### `jobs`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `title` | `varchar(500)` | Job title |
| `description` | `text` | Full job description |
| `raw_input` | `text` | Original pasted text |
| `client_info` | `jsonb` | Parsed client data |
| `budget_type` | `varchar(20)` | fixed/hourly |
| `budget_min` | `decimal` | |
| `budget_max` | `decimal` | |
| `category` | `varchar(255)` | |
| `skills_required` | `jsonb` | |
| `source_url` | `text` | Upwork URL if provided |
| `status` | `varchar(20)` | pending/analyzed/qualified/archived |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

### `job_analyses`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `job_id` | `uuid` | FK → jobs |
| `hiring_intent_score` | `integer` | 1-10 |
| `connect_investment_score` | `integer` | 1-10 |
| `client_reliability_score` | `integer` | 1-10 |
| `hiring_probability` | `integer` | 0-100 % |
| `confidence_level` | `varchar(20)` | low/medium/high |
| `recommendation` | `varchar(30)` | apply/conditional/skip |
| `risk_factors` | `jsonb` | Array of risk strings |
| `client_psychology` | `jsonb` | fears, triggers, motivations |
| `root_pain` | `jsonb` | problem, cause, impact |
| `problem_consequences` | `jsonb` | |
| `solution_strategy` | `jsonb` | |
| `raw_analysis` | `text` | Full agent output |
| `created_at` | `timestamp` | |

### `proposals`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `job_id` | `uuid` | FK → jobs, nullable |
| `title` | `varchar(500)` | |
| `content` | `text` | Final proposal text |
| `hooks` | `jsonb` | Array of 5 hooks |
| `discovery_questions` | `jsonb` | Array of questions |
| `ctas` | `jsonb` | Array of CTAs |
| `tone` | `varchar(50)` | |
| `word_count` | `integer` | |
| `version` | `integer` | Default 1 |
| `status` | `varchar(20)` | draft/final/sent/won/lost |
| `outcome_notes` | `text` | User feedback on result |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

### `proposal_templates`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `name` | `varchar(255)` | |
| `description` | `text` | |
| `content_template` | `text` | Template with placeholders |
| `category` | `varchar(100)` | web-dev, mobile, design, etc. |
| `is_default` | `boolean` | |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

### `agent_runs`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `job_id` | `uuid` | FK → jobs, nullable |
| `proposal_id` | `uuid` | FK → proposals, nullable |
| `agent_name` | `varchar(100)` | Which agent ran |
| `agent_version` | `varchar(20)` | |
| `input` | `jsonb` | What was sent |
| `output` | `jsonb` | What came back |
| `model_used` | `varchar(100)` | OmniRoute model ID |
| `tokens_input` | `integer` | |
| `tokens_output` | `integer` | |
| `duration_ms` | `integer` | Execution time |
| `status` | `varchar(20)` | running/completed/failed |
| `error` | `text` | Error message if failed |
| `created_at` | `timestamp` | |

### Entity Relationship Diagram

```
users 1──────┬──────* proposals
             │
             ├──────* jobs ──────1 job_analyses
             │
             ├──────* proposal_templates
             │
             ├──────1 user_settings
             │
             └──────* agent_runs
                        │
          proposals *───┘ (nullable)
          jobs *────────┘ (nullable)
```

---

## 7. AI Agent Definitions

### Agent Pipeline Flow

```
Job Input
    │
    ▼
┌─────────────────────┐
│  1. QUALIFICATION    │  → Hiring Intent, Connect Investment,
│     AGENT            │    Client Reliability, Probability,
│                      │    Risk Factors, Recommendation
└──────────┬──────────┘
           │ (if recommendation ≠ skip)
           ▼
┌─────────────────────┐
│  2. CLIENT           │  → Biggest Fear, Hidden Frustration,
│     PSYCHOLOGY       │    Emotional Trigger, Buying Motivation,
│     AGENT            │    Desired Outcome
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. PAIN ANALYSIS    │  → Root Cause, Business Impact,
│     AGENT            │    Revenue Impact, Productivity Impact,
│                      │    Opportunity Cost, Risk if Ignored
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4. HOOK GENERATION  │  → 5 Personalized Opening Hooks
│     AGENT            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  5. SOLUTION         │  → Discovery → Audit → Root Cause →
│     STRATEGY         │    Implementation → Testing →
│     AGENT            │    Optimization → Reporting
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  6. PROPOSAL WRITER  │  → 100-150 word final proposal,
│     AGENT            │    Discovery Questions, CTAs
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  7. QUALITY REVIEWER │  → Score (1-10), Feedback,
│     AGENT            │    Revision Suggestions,
│                      │    Pass/Fail Gate
└─────────────────────┘
```

### Agent Definitions

#### Agent 1: Qualification Agent
- **Input:** Job title, description, client profile data
- **Output:** Scores (hiring intent, connect investment, client reliability), hiring probability, confidence level, risk factors, recommendation
- **Model:** Fast model (e.g., GPT-4o-mini via OmniRoute)
- **Purpose:** Gate — determines if the opportunity is worth pursuing before spending tokens on a full pipeline

#### Agent 2: Client Psychology Agent
- **Input:** Job description, client profile, qualification results
- **Output:** Biggest fear, hidden frustration, emotional trigger, desired outcome, buying motivation
- **Model:** Strong reasoning model (e.g., Claude Sonnet via OmniRoute)
- **Purpose:** Understanding the human behind the job post to personalize the proposal

#### Agent 3: Pain Analysis Agent
- **Input:** Job description, client psychology output
- **Output:** Root problem, root cause, why previous attempts failed, business/revenue/productivity impact, opportunity cost, risk if ignored
- **Model:** Strong reasoning model
- **Purpose:** Identifying the real problem (not just the stated one)

#### Agent 4: Hook Generation Agent
- **Input:** Job description, client psychology, pain analysis
- **Output:** 5 unique opening hooks
- **Model:** Creative model (e.g., Claude Sonnet or GPT-4o)
- **Purpose:** Creating attention-grabbing openings that demonstrate immediate understanding
- **Rules:** No generic greetings, must reference specific pain points

#### Agent 5: Solution Strategy Agent
- **Input:** Job description, pain analysis, user profile (skills, portfolio)
- **Output:** Step-by-step strategy (discovery → audit → root cause → implementation → testing → optimization → reporting)
- **Model:** Strong reasoning model
- **Purpose:** Demonstrating expertise through a clear methodology

#### Agent 6: Proposal Writer Agent
- **Input:** All previous agent outputs + user profile + selected hook + template (optional)
- **Output:** Final proposal (100-150 words), 5 discovery questions, 5 CTAs
- **Model:** Best available model (e.g., Claude Sonnet)
- **Purpose:** Synthesizing everything into a human, conversational, high-conversion proposal
- **Rules:** Grade 6-8 reading level, no bullet points, no banned phrases

#### Agent 7: Quality Reviewer Agent
- **Input:** Final proposal, original job description, all agent outputs
- **Output:** Score (1-10), feedback, specific revision suggestions, pass/fail
- **Model:** Strong reasoning model
- **Purpose:** Quality gate before presenting to user — catches generic language, banned phrases, missing personalization
- **Threshold:** Score ≥ 7 = pass, < 7 = sent back to Proposal Writer with feedback

### Agent Base Class Interface

```typescript
interface AgentConfig {
  name: string;
  version: string;
  description: string;
  model: string;           // OmniRoute model identifier
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  outputSchema: ZodSchema; // Structured output validation
}

interface AgentInput {
  jobData: JobData;
  previousResults?: Record<string, unknown>;
  userProfile?: UserProfile;
  settings?: UserSettings;
}

interface AgentOutput<T> {
  agentName: string;
  success: boolean;
  data: T;
  tokensUsed: { input: number; output: number };
  durationMs: number;
  model: string;
}
```

---

## 8. Development Roadmap

### Phase 1: Foundation (Week 1-2)
- Project scaffolding (Next.js 15, TypeScript, Tailwind, shadcn/ui)
- Docker setup (app + Postgres)
- Drizzle ORM setup + schema + initial migration
- Authentication (NextAuth v5)
- Base layout (sidebar, header, responsive shell)
- Health check endpoint
- Environment configuration
- ESLint + Prettier + Vitest setup

### Phase 2: Core Data Layer (Week 3)
- All Drizzle schemas (users, jobs, proposals, templates, agent_runs, settings)
- Repository functions for each entity
- Service layer with business logic
- Zod validation schemas
- API route handlers (CRUD for all entities)
- Standardized API response format
- Error handling middleware
- Seed script

### Phase 3: AI Agent System (Week 4-5)
- OmniRoute client wrapper
- Base agent abstract class
- Agent registry and configuration
- Prompt builder utility
- Response parser (structured output)
- Implement all 7 agents with system prompts
- Agent pipeline orchestrator (sequential execution)
- Agent run logging
- Token tracking

### Phase 4: Proposal Generation Flow (Week 6-7)
- Job input form (paste URL or text)
- Qualification flow with scoring UI
- Full generation pipeline endpoint
- SSE streaming for real-time generation progress
- Proposal editor with hook selection
- Discovery questions and CTA display
- Proposal preview and export
- Template system

### Phase 5: Dashboard & Polish (Week 8)
- Dashboard with stats (proposals generated, win rate, tokens used)
- Proposal history with filtering
- User settings page (model preferences, API keys, tone defaults)
- Profile page (skills, bio, portfolio for agent context)
- Responsive design pass
- Loading states and error boundaries
- Empty states

### Phase 6: Production Hardening (Week 9-10)
- Rate limiting
- Input sanitization
- API key encryption
- CORS configuration
- Security headers
- Structured logging
- Unit tests (services, agents)
- Integration tests (API routes)
- E2E tests (critical paths)
- CI/CD pipeline
- Production Dockerfile
- Deployment documentation

### Phase 7: Future Enhancements (Post-Launch)
- Upwork URL scraping/parsing
- Proposal A/B testing
- Win/loss tracking with feedback loop
- Team accounts
- Bulk analysis
- Chrome extension
- Analytics dashboard
- Webhook integrations
- Multi-language proposals
