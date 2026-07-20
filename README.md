# Proposal Agent

[![CI](https://github.com/usama-jadoon/proposal-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/usama-jadoon/proposal-agent/actions/workflows/ci.yml)

An AI-powered application designed to streamline Upwork job analysis and proposal generation. It analyzes job descriptions, extracts necessary skills, estimates hiring probabilities, maps out client psychology, and drafts highly targeted and personalized proposals using Anthropic/OpenAI via an OmniRoute backend orchestration layer.

## Architecture

This project is built using:
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (with Neon/Local)
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS V4
- **Component Lib:** Base UI & Custom UI with tailwind
- **AI Orchestration:** OmniRoute standard bridging into structured JSON models

## Features
- **Job Ingestion:** Paste an Upwork URL and extract relevant details constraints instantly.
- **AI Orchestration Pipeline:**
  - **Qualification Agent:** Determines intent/win probability based on budget and client data.
  - **Psychology Agent:** Evaluates fears and requirements based on word usage.
  - **Strategy & Proposal Agents:** Writes the winning draft with alternate hooks.
- **Dashboard UI:** View aggregated insights and generated outputs dynamically.
- **Resilience:** Implemented exponential backoffs, DB query rate-limits, and toast notifications.

## Local Setup

### 1. Prerequisites
- Node.js LTS (v20+)
- PostgreSQL Database
- Upwork / OpenAI Developer credentials

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgres://user:password@localhost:5432/db"
BETTER_AUTH_SECRET="your_secure_secret"
BETTER_AUTH_URL="http://localhost:3000"
OMNIROUTE_API_KEY="sk-..."
```

### 3. Installation

```bash
npm install
```

### 4. Database Setup

```bash
# Push the Drizzle schema to your connected DB
npm run db:push

# Verify via Studio (Optional)
npm run db:studio
```

### 5. Running the App

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to register, connect your keys, and begin importing jobs.

## Monitoring & Best Practices
- **Security:** Standard HTTP strict transport and X-Frame headers built natively into next.config.
- **Rate-Limiting:** Imported routes adhere to 10 min window constraints.
- **Health Checks:** Monitor infrastructure health at `/api/health`.

## License
MIT
