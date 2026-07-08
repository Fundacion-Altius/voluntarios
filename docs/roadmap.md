# Roadmap

> This roadmap reflects the project's actual state based on the OpenSpec change log. Phases are ordered by dependency — each builds on the previous. Dates are approximate and subject to change.

---

## Phase 1: Foundation (Completed)

The core platform is built and running in production. All items below are archived as completed changes.

| Change | What was delivered |
|---|---|
| Auth & RBAC | JWT auth with HTTP-only cookies. Role-based middleware (`admin`, `nave`, `general`). Microsoft/Supabase social login. |
| Database setup | Initial Drizzle ORM scaffolding. SQL table creation and seeding for Supabase. Users table with roles. |
| Contract wizard | Multi-step form (datos, confidencialidad, firma). Duracion/modalidad as RadioGroup. PDF generation for signed contracts. |
| Dashboard | DataTable with pagination, sorting, search, and role-based filtering. |
| Testing infrastructure | Backend migrated to Vitest (from Jest). Frontend E2E migrated to Playwright (from Cypress). Critical unit tests for auth, error-handler, PDF, DB init, and repo mocks. E2E tests with real API flows. |
| API stack | Zod request validation. OpenAPI 3.1 generation + Scalar docs UI. Helmet security headers. TanStack Query hooks. Typed API client via `@hey-api/openapi-ts`. |
| Production verification | Supabase connectivity verified. Pagination fixed. All endpoints tested against production. |

**Success criteria met:** Volunteers can sign contracts end-to-end. Admins can manage contracts via the dashboard. API is documented, validated, and secured.

---

## Phase 2: Unify Database Layer (Completed)

**Theme:** Replace the three-pattern data access (in-memory / MariaDB Drizzle / Supabase REST) with a single Drizzle ORM + Postgres code path.

| Milestone | Deliverables | Success Criteria |
|---|---|---|
| Docker Postgres | Add `docker-compose.yml` with Postgres 16 + Redis 7. Mount `init.pg.sql`. | `docker compose up -d` starts both containers. App connects with `NODE_ENV=staging`. |
| Drizzle PG schema | Define all 8 tables (`users`, `roles`, `user_roles`, `contratos`, `encuestas`, `preguntas`, `survey_answers`, `survey_submissions`) in `src/db/schema/pg/`. | Drizzle Kit generates valid SQL. `db:pg:push` creates tables in Postgres. |
| PG repositories | Implement `IPostgresContractRepository`, `IPostgresUserRepository`, `IPostgresSurveyRepository`, etc. Each mirrors the existing `IRepository<T>` interface. | All repository methods return correct `Result<T>` values. Unit tests pass with a real Postgres container. |
| Rewire factory | `repositoryFactory.ts` returns PG repos for `staging`/`production`, in-memory repos for `development`. | Controllers and tests work without changes — only `NODE_ENV` determines backend. |
| Remove legacy code | Delete MariaDB repos, MySQL schema, Supabase REST repos, and `supabase-js` client. | No references to `supabase-js`, `mysql2`, or MariaDB Drizzle remain. `db:mysql:*` scripts removed. |

**Why:** A single data-access path reduces bugs, simplifies onboarding, and eliminates the maintenance burden of three backends.

---

## Phase 3: Survey Lifecycle (Completed)

**Theme:** Deliver the full survey system — admin CRUD, anonymous submission, and 24-hour email scheduling.

| Milestone | Deliverables | Success Criteria |
|---|---|---|
| Survey CRUD | `GET/POST/PUT/DELETE /api/surveys`, `GET/POST /api/questions`. Admin-only for mutations. | All endpoints work against in-memory and PG repos. |
| Anonymous submission | `POST /api/surveys/submit-answer` accepts answers with no auth. `GET /api/surveys/get-report` returns aggregated results (auth required). | Surveys are truly anonymous. Report endpoint respects role-based access. |
| Delayed email scheduling | Bull queue enqueues a job when a contract is signed. Worker waits 24h, loads template, sends via Nodemailer, logs to notification store. Falls back to `setTimeout` in dev. | Survey email arrives ~24h after signing. Retry on failure (3 attempts). Dev mode works without Redis. |
| Email templates | HTML templates for survey invitation, styled and bilingual (Spanish). Rendered via `emailTemplateService.ts`. | Templates render correctly in major email clients. Links point to the survey page. |
| Frontend survey page | `/encuesta` page with star rating, text fields. Pulled from `origin/dev` and integrated. | Volunteer can submit feedback in under 2 minutes. Submission shows a thank-you screen. |
| Integration tests | Supertest tests for the full flow: create survey → sign contract → check job enqueued → submit answer → verify report. | Tests pass in CI with Docker Postgres + Redis. |

**Why:** Closing the feedback loop with volunteers is a core requirement. Automated scheduling ensures no volunteer is missed.

### Backoffice UX Improvement (Completed)

**Theme:** Improve the admin backoffice experience with a responsive layout, KPI dashboard, contract management page, user management, and survey management UI.

| Milestone | Deliverables | Success Criteria |
|---|---|---|
| Responsive admin layout | Shared layout with auth guard, top bar, and left sidebar (drag-to-collapse, icon-only mode, mobile overlay/hamburger). | Sidebar has three states: open (~240px), icon-only (~64px), hidden on mobile. ARIA accessible. |
| Contracts page | Contracts table moved from `/dashboard` to `/contratos`. Maintains DataTable, search, area/location filters, role-based filtering, PDF download. | `GET /api/contratos` works. URL changed. All old features preserved. |
| KPI dashboard | Metric cards, line chart (contracts/month), bar chart (contracts by location), pie chart (corporate vs independent), recent contracts widget. `/dashboard/stats` API provides aggregated data for both PG and in-memory repos. | Charts render with recharts. Stats API returns all 7 metric groups. Works with both dev and PG. |
| User management | CRUD for users at `/usuarios`. DataTable with search, create/edit/delete dialogs. | `GET/POST/PUT/DELETE /api/users` wired. Dialogs handle success/error. |
| Survey management | Survey list at `/encuestas` with create dialog. "Ver Resultados" button opens modal with question-by-question average ratings. | Report data loads from `GET /api/surveys/get-report`. Averages display correctly. |

**Why:** A polished admin experience reduces friction for operations staff, centralizes management of contracts, users, and surveys, and provides actionable KPI insights.

---

## Phase 4: Hardening & Coverage

**Theme:** Close testing gaps, improve observability, and handle edge cases before expanding scope.

| Milestone | Deliverables | Success Criteria |
|---|---|---|
| Controller unit tests | Auth controller, survey controller, contract controller — full mutation coverage. | `pnpm test` passes with >70% line coverage on controllers. |
| Repository tests | In-memory repo unit tests for all entities. PG repo integration tests with Docker. | Every `IRepository<T>` method is tested at least once. |
| Error monitoring | Integrate Sentry (or equivalent) for backend and frontend. | Unhandled errors surface in Sentry dashboard. Error boundary catches frontend crashes. |
| Production runbook | Document deploy steps, env vars, health checks, rollback procedure. | A new operator can deploy and recover the system without asking for help. |

---

## Phase 5: Future (Speculative)

Items below are informed by the existing spec backlog and product feedback. They are not committed — they will be resourced based on actual usage data.

| Area | Possible work |
|---|---|
| Volunteer portal | Login for volunteers to view contract history, re-download PDFs, update contact info. |
| Bulk operations | Select multiple contracts → export CSV, send bulk reminders, mark as renewed. |
| Multi-language | Add English and Catalan. i18n for frontend and email templates. |
| Analytics dashboard | Charts for signings per week, area breakdown, survey scores over time. |
| Accessibility | WCAG 2.1 AA compliance audit and remediation. |
| CI/CD pipeline | Automated test → lint → typecheck → deploy to staging on PR, to production on merge to main. |

---

## Current Status

| Phase | Status |
|---|---|---|
| Phase 1: Foundation | Complete |
| Phase 2: Unify Database Layer | Complete |
| Phase 3: Survey Lifecycle | Complete |
| Phase 3: Backoffice UX Improvement | Complete |
| Phase 4: Hardening & Coverage | Not started |
| Phase 5: Future | Not started |
