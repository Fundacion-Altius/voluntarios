## Context

The repo has two independent packages: `voluntarios-back/` (Express + TypeScript, port 3001) and `voluntarios-front/` (Next.js 14 App Router, port 3000). Both have remote branches (`dev`, `build`) containing survey feature code that was never merged to `main`. The current `main` branch in the backend has partial survey code (schemas, controllers, Supabase repos) but:

- No routes wired to Express
- No in-memory or MariaDB survey repositories
- A race condition in `submitSurvey` (uses `.at(-1)` to get submission ID)
- Hardcoded Supabase dependencies in answer/submission controllers

The frontend `main` has zero survey code. Remote branches have survey pages (`/encuesta`), star rating components, and API calls.

## Goals / Non-Goals

**Goals:**
- Pull survey code from remote branches without breaking existing contract/user/PDF functionality
- Add 24-hour delayed email scheduling using Bull + Redis
- Wire everything with TDD — tests first for all new code
- Support all three environments: development (in-memory), staging (MariaDB), production (Supabase)
- Anonymous survey submission (no auth required for the submit endpoint)

**Non-Goals:**
- Not restructuring the codebase into the modular monolith pattern from the `dev` branch (staying with the flat `main` structure)
- Not adding survey result charts/dashboard (out of scope)
- Not adding SMS notifications (only email)
- Not adding i18n or multi-language support

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  CONTRACT SIGNED (POST /api/contracts)                   │
│                                                          │
│  ┌─────────────────────┐    ┌─────────────────────────┐  │
│  │ contractController   │───▶│ surveyEmailScheduler    │  │
│  │ (existing, modified) │    │ (new)                   │  │
│  └─────────────────────┘    │  Bull.enqueue(           │  │
│                              │    'send-survey-email',  │  │
│                              │    {email, name,         │  │
│                              │     surveyId},           │  │
│                              │    {delay: 24h}          │  │
│                              │  )                       │  │
│                              └──────────┬──────────────┘  │
│                                         │                 │
│                              ┌──────────▼──────────────┐  │
│                              │  Bull Worker             │  │
│                              │  (separate process or    │  │
│                              │   embedded in server)    │  │
│                              │                          │  │
│                              │  1. Load email template  │  │
│                              │  2. Send via Nodemailer  │  │
│                              │  3. Save notification    │  │
│                              │  4. Mark job complete    │  │
│                              └──────────────────────────┘  │
│                                         │                  │
│                                         ▼                  │
│                              ┌──────────────────────────┐  │
│                              │  VOLUNTEER RECEIVES EMAIL  │  │
│                              │  with link to /encuesta    │  │
│                              └──────────────────────────┘  │
│                                         │                  │
│                                         ▼                  │
│  ┌────────────────────┐    ┌─────────────────────────┐  │
│  │ /encuesta           │    │ POST /api/surveys/       │  │
│  │ ClientRatingForm    │───▶│ submit-answer            │  │
│  │ StarRating          │    │ (anonymous, no auth)     │  │
│  └────────────────────┘    └─────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Decisions

### Decision 1: Keep flat structure, don't adopt modular monolith
The `dev` branch restructured into domain modules (`src/surveys/`, `src/users/`, etc.). Adopting this would break all existing imports and require restructuring the entire `main` branch. Instead, we adapt the survey code from `dev` to fit the flat structure on `main`.

**Alternatives considered:**
1. ✅ **Flat structure (chosen)** — lower risk, less churn, focused change
2. ❌ Adopt modular monolith — would touch every file, high risk of breaking existing code
3. ❌ Write everything from scratch — ignores valuable existing work

### Decision 2: Bull + Redis for delayed jobs
Bull is already in `package.json` as a declared dependency (never used). Redis is the standard backend for Bull. Alternatives:
1. ✅ **Bull + Redis** — production-grade, persistence across restarts, retries, monitoring UI
2. ❌ `setTimeout` with in-memory — lost on restart, no persistence, no monitoring
3. ❌ `node-cron` — not suitable for per-contract scheduling (would need DB polling)
4. ❌ `bullmq` — newer but unnecessary, Bull is sufficient and already in dependencies

### Decision 3: Anonymous survey submission endpoint
The submit-answer endpoint does NOT require authentication. Rationale: the survey is anonymous by nature (the email is sent to a volunteer but the survey itself doesn't identify them).

### Decision 4: Survey routes wired into existing Express router
Add survey routes to the existing `src/api/routes/index.ts` with `authenticateToken` middleware for all routes except `POST /submit-answer`.

### Decision 5: In-memory repositories for survey entities
We need in-memory implementations matching the `IRepository<T>` interface. These follow the same pattern as `inMemoryContractRepository.ts` and `inMemoryUserRepository.ts`.

### Decision 6: Fix race condition by using DB return value
The current `submitSurvey` uses `getAll().at(-1)` to find the created submission ID. Replace with proper return value from `create()` — the Supabase and MariaDB repos should return the created entity's ID.

### Decision 7: Environment-based repo switching
Use the same pattern as `main`'s existing code: a factory function that checks `NODE_ENV` and returns the appropriate repository implementation.

## Reuse Strategy: What to Pull from Remote Branches

### Backend — from `origin/dev`:

| File on `dev` | Where it goes on `main` | Adaptation needed |
|---|---|---|
| `src/surveys/0_domain/Survey.ts` | `src/entities/Survey.ts` | Already exists on main, keep existing version |
| `src/surveys/0_domain/Question.ts` | `src/entities/Question.ts` | New file, adapt types |
| `src/surveys/0_domain/SurveyAnswer.ts` | `src/entities/SurveyAnswer.ts` | New file, adapt types |
| `src/surveys/0_domain/SurveySubmission.ts` | `src/entities/SurveySubmission.ts` | New file, adapt types |
| `src/surveys/2_interface/controllers/surveyController.ts` | `src/api/controllers/surveyController.ts` | Already exists, fix race condition + env switching |
| `src/surveys/2_interface/controllers/questionController.ts` | `src/api/controllers/questionController.ts` | New file, adapt to flat structure |
| `src/surveys/2_interface/controllers/surveyAnswerController.ts` | `src/api/controllers/surveyAnswerController.ts` | Already exists, fix hardcoded Supabase |
| `src/surveys/2_interface/controllers/surveySubmissionController.ts` | `src/api/controllers/surveySubmissionController.ts` | Already exists, fix hardcoded Supabase |
| `src/surveys/3_infrastructure/routes/surveyRoutes.ts` | `src/api/routes/surveyRoutes.ts` | New file, adapt imports |
| `src/surveys/3_infrastructure/routes/questionRoutes.ts` | `src/api/routes/questionRoutes.ts` | New file, adapt imports |
| `src/surveys/3_infrastructure/routes/surveyAnswerRoutes.ts` | `src/api/routes/surveyAnswerRoutes.ts` | New file, adapt imports |
| `src/surveys/3_infrastructure/routes/surveySubmissionRoutes.ts` | `src/api/routes/surveySubmissionRoutes.ts` | New file, adapt imports |
| `src/surveys/3_infrastructure/repositories/mariaDB/mariaDBSurveyRepository.ts` | `src/infra/mariaDB/mariaDBSurveyRepository.ts` | New file, adapt to match existing MariaDB patterns |
| `src/surveys/__tests__/surveyApi.spec.ts` | `src/api/controllers/surveyController.spec.ts` | Already exists partially, merge tests |
| `src/surveys/__tests__/survey.usecase.spec.ts` | `src/api/controllers/surveyController.spec.ts` | Merge test cases |

**Not reused (different architecture, would break compatibility):**
- `src/surveys/1_application/surveyUsecase.ts` — adds abstraction layer not present on `main`
- `src/notifications/` — the full notification module with in-memory repo; we'll write a simpler version that works with the existing flat structure

### Frontend — from `origin/dev`:

| File on `dev` | Where it goes on `main` | Adaptation needed |
|---|---|---|
| `src/app/encuesta/page.tsx` | `src/app/encuesta/page.tsx` | Direct copy |
| `src/app/encuesta/ClientRatingForm.tsx` | `src/app/encuesta/ClientRatingForm.tsx` | Direct copy |
| `src/app/encuesta/confirmacion/page.tsx` | `src/app/encuesta/confirmacion/page.tsx` | Direct copy |
| `src/app/gracias/page.tsx` | `src/app/gracias/page.tsx` | Already exists on main |
| `src/components/ratings/star-rating.tsx` | `src/components/ratings/star-rating.tsx` | Direct copy |
| `src/app/api/index.ts` (survey functions) | `src/app/api/index.ts` or `src/app/lib/api.ts` | Merge survey functions into existing API layer |
| `src/app/types.ts` (Question type) | `src/app/types.ts` | Add Question type |

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| Redis not available in dev | Bull fails to connect | Fall back to in-memory queue in development mode (Bull supports this) |
| SMTP misconfiguration | Emails silently fail | Add health check for SMTP, log errors, Bull retries |
| Race condition in submitSurvey | Answers attached to wrong submission | Fix by returning submission ID from create() — test with concurrent requests |
| Frontend survey pages conflict with existing routes | 404 or wrong page | Next.js App Router handles `/encuesta` as a new route segment — no conflict |
| Environment variables not set for new features | Feature broken in production | Add startup validation for required vars (REDIS_URL, SMTP_*) |
