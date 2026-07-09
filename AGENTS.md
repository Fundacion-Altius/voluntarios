# AGENTS.md

## Repo structure

Monorepo with two packages: `voluntarios-back/` (Express + TypeScript) and `voluntarios-front/` (Next.js 14 App Router + React 18). No monorepo tool — each is independent with its own `package.json`.

## Backend (`voluntarios-back/`)

- **Package manager:** pnpm (always use pnpm, never npm)
- **Runtime:** Express, TypeScript (`ts-node`), tsconfig-paths (`@/` → `src/`)
- **Port:** 3001 (env `PORT`)
- **Database:** Two backends selected by `NODE_ENV`:
  - `development` → in-memory arrays
  - `staging` / `production` → Postgres via Drizzle ORM + postgres.js
- **Pattern:** `IRepository<T>` interface with `Result<T>` discriminated union
- **Schema:** Single Drizzle PG schema in `src/db/schema/pg/` (8 tables: `users`, `roles`, `user_roles`, `contratos`, `encuestas`, `preguntas`, `survey_answers`, `survey_submissions`)
- **Migrations:** Drizzle Kit (Postgres), config `drizzle.pg.config.ts`, output in `drizzle/pg/`
- **Connections:** Each repo uses `postgres.js` + `drizzle-orm/postgres-js`; staging uses `DB_*` env vars, production uses `SUPABASE_DB_*` env vars
- **Import Style:** All imports must use path aliases (e.g., `import { users } from "@/db/schema/pg/users"`)
- **Repository factory:** `src/infra/repositoryFactory.ts` exports `getContractRepository()`, `getUserRepository()`, `getSurveyRepository()`, `getQuestionRepository()`, `getSurveyAnswerRepository()`, `getSurveySubmissionRepository()` — env-based selection (dev→in-memory, staging/prod→Postgres)
- **Survey routes:** Registered in `src/api/routes/index.ts`:
  - `GET /api/surveys` — list surveys (auth required)
  - `POST /api/surveys` — create survey (admin)
  - `GET /api/surveys/:id` — get survey by ID (auth required)
  - `PUT /api/surveys/:id` — update survey (admin)
  - `DELETE /api/surveys/:id` — delete survey (admin)
  - `GET /api/questions` — list questions (public, needed for survey form)
  - `POST /api/questions` — create question (admin)
  - `POST /api/surveys/submit-answer` — submit survey (public, anonymous)
  - `GET /api/surveys/get-report` — get survey report (auth required)
- **Email scheduling:** Bull queue (staging/prod) or in-memory setTimeout (dev):
  - `src/services/surveyEmailScheduler.ts` — enqueues jobs with 24h delay
  - `src/services/surveyEmailWorker.ts` — loads template, sends via Nodemailer, logs notification
  - `src/services/emailTemplateService.ts` — loads/renders HTML templates from `src/email-templates/`
  - `src/services/notificationService.ts` — in-memory notification store
  - Wiring: `src/services/index.ts` calls `setJobHandler(sendSurveyEmail)` on startup
- **Contract flow:** After contract creation (`contractController.createContract`), a survey email is scheduled automatically via `surveyEmailScheduler.schedule()`

### Env file loading

- `src/utils/loadEnv.ts` — loads `.env` first, then applies `ENV_FILE` overrides if set
- `.env` — base config (Supabase prod creds, Ethereal SMTP, Azure AD, etc.)
- `.env.staging` — SMTP overrides for staging (Mailpit)
- `.env.production` — SMTP overrides for production (Office365)
- `.env.test` — Supabase test DB overrides (Office365 SMTP) loaded via `ENV_FILE=.env.test`

### Key scripts

| Command | Purpose |
|---|---|
| `pnpm run dev` | NODE_ENV=development, in-memory |
| `pnpm run staging` | NODE_ENV=staging, local Postgres |
| `pnpm run dev:supa` | NODE_ENV=production, Supabase Postgres |
| `pnpm run dev:supa:test` | NODE_ENV=production, test Supabase (uses `.env.test`) |
| `pnpm test` | Vitest (globals:true, node env) |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run build` | Vite build → `build/` |
| `pnpm run lint` | Biome check (lint + format) |
| `pnpm run format` | Biome format only |
| `pnpm run db:pg:generate` | Drizzle Kit generate (PG schema → SQL migration) |
| `pnpm run db:pg:push` | Drizzle Kit push (apply schema to local/staging Postgres) |
| `pnpm run db:pg:push:test` | Drizzle Kit push to test Supabase (uses `.env.test`) |
| `pnpm run db:pg:migrate` | Drizzle Kit migrate (run SQL migrations) |

### Testing

- **Vitest** (config: `vitest.config.ts`), suites in `src/**/*.{spec,test}.ts`
- Test pattern: `inMemoryUserRepository.spec.ts` (unit), `contractApi.spec.ts` (supertest API)
- Postgres integration tests: `src/**/*.integration.test.ts`, run with `NODE_ENV=staging`, require `docker compose up -d`
- Controller tests use real in-memory repos (not mocks) — see `surveyController.spec.ts` for pattern
- Service tests use `vi.useFakeTimers()` for scheduler delay — see `surveyEmailScheduler.spec.ts`

### Docker

Two containers, start with `docker compose up -d` from `voluntarios-back/`:
- `voluntarios-db` — Postgres 16-alpine, port 5432, mounts `init.pg.sql`
- `voluntarios-redis` — Redis 7, port 6379, used by Bull for delayed email jobs in staging/production

## Frontend (`voluntarios-front/`)

- **Package manager:** pnpm (has `pnpm-lock.yaml`; do NOT use npm)
- **Runtime:** Next.js 14 App Router, React 18
- **Port:** 3000
- **API:** calls backend via `NEXT_PUBLIC_API_URL` env var (`.env.development` = `http://localhost:3001`)
- **State:** React Context (`context.tsx`) for multi-step wizard
- **Route structure:** `src/app/page.tsx` (home/Contract wizard), `/encuesta` (survey form with star ratings), `/encuesta/confirmacion` (thank you), `/datos`, `/confidencialidad`, `/imagen` (legal pages). Admin routes under `(admin)` route group: `/dashboard`, `/contratos`, `/usuarios`, `/encuestas`
- **Alias:** `@/` → `src/`

### Key scripts

| Command | Purpose |
|---|---|
| `pnpm run dev` | Next.js dev server |
| `pnpm test` | Jest (via next/jest, jsdom) |
| `pnpm run test:e2e` | Playwright (chromium only) |
| `pnpm run test:e2e:email-flow` | E2E contract→email flow (random email, for staging) |
| `pnpm run test:e2e:email-flow:prod` | E2E contract→email flow (`creciendotech@gmail.com`, for test Supabase) |
| `pnpm run build` | Next build |

### UI

- **shadcn** components for protected pages (dashboard, login)
- Use existing `shadcn` components via `src/components/ui/*`:
  `Button`, `Card`, `Table`, `Badge`, etc.
- Add new shadcn components with: `pnpx shadcn@latest add <component>`
- **recharts** for KPI charts (line, bar, pie) on the admin dashboard

### E2E Email Flow Test

Two test files for contract creation → email delivery:

- **`contract-email-flow.spec.ts`** — staging: uses random email `test-${uniqueId}@test.com`, backend uses `create`
- **`contract-email-flow-prod.spec.ts`** — production/test Supabase: uses `creciendotech@gmail.com`, backend uses `upsert`

**Backend logic** (`contractController.ts`):
- `NODE_ENV=production` → `getUserRepository().upsert(newUser)` (update if exists)
- Otherwise → `getUserRepository().create(newUser)` (insert, fails on duplicate)

**How to run:**

```bash
# Staging (local Postgres + Mailpit)
# Terminal 1:
cd voluntarios-back && docker compose up -d   # Postgres + Redis + Mailpit
pnpm run staging

# Terminal 2:
cd voluntarios-front && pnpm run test:e2e:email-flow

# Test Supabase (real Office365 email)
# Terminal 1:
cd voluntarios-back && pnpm run dev:supa:test

# Terminal 2:
cd voluntarios-front && pnpm run test:e2e:email-flow:prod
```

## General

- **Task management:** `openspec` CLI — `openspec status`, `openspec instructions apply`
- **Lint:** Biome (`biome.json`), `noExplicitAny: off`, `noUnusedVariables: off`
- **Commits:** Conventional commits enforced by commitlint (`@commitlint/config-conventional`)
- **Format:** Biome (via `biome format` or `biome check`)
- **No CI/CD workflows** in this repo
- **No pre-commit hooks** detected

### Backup Script

Run `./backup-envs.sh` before committing to preserve a copy of all `.env` files in `~/Documentos/dev/secrets/`. A pre-commit hook blocks accidental commits of `.env` files (use `--no-verify` to bypass).

## Git Branching Strategy

The repository follows a standardized branching strategy integrated with OpenSpec:

### Branch Hierarchy
```
main (protected) ← ONLY production code
    ↑
dev (protected)  ← Integration/staging for completed features
    ↑
feat/*           ← Feature development (1 per OpenSpec change)
```

### Branch Types and Purposes

**main branch:**
- **Purpose:** Production code only
- **Protection:** Strict (2 approvals, status checks required)
- **Access:** Read-only for most developers, merges via pull requests only
- **Deployment:** Directly to production environment

**dev branch:**
- **Purpose:** Integration and staging for completed features
- **Protection:** Moderate (1 approval, status checks required)
- **Access:** Feature branches merge here via pull requests
- **Deployment:** Staging environment for integration testing

**feat/* branches:**
- **Purpose:** Individual feature development
- **Naming:** `feat/<change-name>` where `<change-name>` matches OpenSpec change directory
- **Protection:** None (development freedom)
- **Lifecycle:** Created from dev → developed → merged to dev → deleted

### Workflow

1. **Proposal Phase:**
   ```bash
   openspec propose "feature-name"
   # Creates openspec/changes/feature-name/
   # Suggests: git checkout -b feat/feature-name
   ```

2. **Development Phase:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/feature-name dev
   # IMPORTANT: Always branch from dev, never from main
   # Implement all tasks from tasks.md
   # Regular commits with task references
   # Frequent merges from dev to stay updated
   ```

3. **Completion Phase:**
   ```bash
   openspec archive-change "feature-name"
   # Validates all tasks complete
   # Creates PR: feat/feature-name → dev
   # Adds archive timestamp to proposal.md
   # Updates main specs from delta specs
   # Offers to delete feature branch
   ```

4. **Release Phase:**
   ```bash
   git checkout -b release/v1.2.0 dev
   # Test release candidate
   git checkout main && git merge release/v1.2.0
   git tag v1.2.0
   # Deploy main to production
   ```

### Hotfix Workflow

```bash
# Critical production issue
git checkout -b hotfix/description main
# Implement and test fix
git checkout main && git merge hotfix/description
git tag v1.2.1
# Deploy to production immediately
git checkout dev && git merge hotfix/description
git branch -d hotfix/description
```

### OpenSpec Integration

- **1:1 Mapping:** Each OpenSpec change → 1 feature branch
- **Branch Creation:** Suggested at `openspec propose`
- **Branch Validation:** Checked at `openspec apply-change`
- **Merge Automation:** Triggered at `openspec archive-change`

### Migration from Previous Strategy

The repository previously used multiple long-lived branches (deploy-v2, build, etc.). These have been consolidated:
- `deploy-v2` → merged into `dev`
- `build` → removed (build artifacts don't belong in git)
- Temporary branches → cleaned up

### Branch Protection Rules

**main branch:**
- ✅ Require pull requests
- ✅ Require 2 approvals
- ✅ Require status checks (CI passes)
- ✅ No force pushes
- ✅ Linear history required

**dev branch:**
- ✅ Require pull requests
- ✅ Require 1 approval
- ✅ Require status checks (CI passes)
- ❌ Force pushes allowed (for rebase cleanup)

**feat/* branches:**
- ❌ No protection (development freedom)
- ✅ Encourage frequent commits
- ✅ Suggest task references in commit messages

## OpenSpec conventions for status reporting

- The change directory name under `openspec/changes/` (the slug) MUST match
  the git branch name for that change, exactly.
- Before moving a change to `openspec/changes/archive/`, add a line to the
  bottom of its `proposal.md`:
  `Archived: YYYY-MM-DD`
- Before archiving, confirm the corresponding entry in `openspec/specs/`
  reflects the change. Do not archive if it doesn't — update the spec first.
## Status manifest

Before generating any status report, run:
`node ~/dev/program-status/scripts/generate-status.js --path .`
