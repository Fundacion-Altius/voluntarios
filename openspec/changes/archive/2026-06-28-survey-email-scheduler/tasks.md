## 1. Repository Setup

- [x] 1.1 Create new branch `feat/survey-email` off `main` in `voluntarios-back`
- [x] 1.2 Create new branch `feat/survey-email` off `main` in `voluntarios-front`
- [x] 1.3 Add required env vars to `.env.example` in backend: `REDIS_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `SURVEY_BASE_URL`
- [x] 1.4 Add required env vars to `.env.development` in frontend: no new vars needed (already has `NEXT_PUBLIC_API_URL`)
- [x] 1.5 Verify existing test suite passes on both repos before any changes (`pnpm test`)

## 2. Backend: In-Memory Survey Repositories (tests first)

- [x] 2.1 Write tests for `inMemorySurveyRepository` (CRUD + edge cases) — `src/infra/inMemory/inMemorySurveyRepository.spec.ts`
- [x] 2.2 Implement `inMemorySurveyRepository.ts` matching `IRepository<Survey>` interface
- [x] 2.3 Write tests for `inMemoryQuestionRepository` — `src/infra/inMemory/inMemoryQuestionRepository.spec.ts`
- [x] 2.4 Implement `inMemoryQuestionRepository.ts`
- [x] 2.5 Write tests for `inMemorySurveyAnswerRepository` — `src/infra/inMemory/inMemorySurveyAnswerRepository.spec.ts`
- [x] 2.6 Implement `inMemorySurveyAnswerRepository.ts`
- [x] 2.7 Write tests for `inMemorySurveySubmissionRepository` — `src/infra/inMemory/inMemorySurveySubmissionRepository.spec.ts`
- [x] 2.8 Implement `inMemorySurveySubmissionRepository.ts`

## 3. Backend: MariaDB Survey Repositories (tests first) — OBSOLETE

Superseded by Drizzle+Postgres repos from `unify-drizzle-pg` change.

- [-] 3.1 Write tests for `mariaDBSurveyRepository` — `src/infra/mariaDB/mariaDBSurveyRepository.spec.ts`
- [-] 3.2 Implement `mariaDBSurveyRepository.ts` (adapt from `dev` branch, follow existing MariaDB patterns)
- [-] 3.3 Write tests for `mariaDBQuestionRepository` — `src/infra/mariaDB/mariaDBQuestionRepository.spec.ts`
- [-] 3.4 Implement `mariaDBQuestionRepository.ts`
- [-] 3.5 Write tests for `mariaDBSurveyAnswerRepository` — `src/infra/mariaDB/mariaDBSurveyAnswerRepository.spec.ts`
- [-] 3.6 Implement `mariaDBSurveyAnswerRepository.ts`
- [-] 3.7 Write tests for `mariaDBSurveySubmissionRepository` — `src/infra/mariaDB/mariaDBSurveySubmissionRepository.spec.ts`
- [-] 3.8 Implement `mariaDBSurveySubmissionRepository.ts`

## 4. Backend: Existing Supabase Repository — Add Survey Methods — OBSOLETE

Superseded by Drizzle+Postgres repos from `unify-drizzle-pg` change.

- [-] 4.1 Write tests for Supabase survey methods — `src/infra/supabase/supabaseRepository.spec.ts` (extend existing)
- [-] 4.2 Verify Supabase survey CRUD methods exist in `src/infra/supabase/supabaseRepository.ts` (already partially on `main`, verify completeness)

## 5. Backend: Survey Routes & Wiring

- [x] 5.1 Create `src/api/routes/surveyRoutes.ts` — wire GET/POST/PUT/DELETE for surveys + submit-answer + get-report
- [x] 5.2 Create `src/api/routes/questionRoutes.ts`
- [x] 5.3 Create `src/api/routes/surveyAnswerRoutes.ts`
- [x] 5.4 Create `src/api/routes/surveySubmissionRoutes.ts`
- [x] 5.5 Register all survey routes in `src/api/routes/index.ts`
- [x] 5.6 Add environment-based repo factory for surveys (matching `NODE_ENV` switching pattern)

## 6. Backend: Fix Existing Survey Controller Bugs

- [x] 6.1 Rewrite tests to use in-memory repos instead of mocks
- [x] 6.2 Fix `submitSurvey` to use env-based factory instead of hardcoded Supabase
- [x] 6.3 Rewrite controller tests with real in-memory repositories
- [x] 6.4 Remove hardcoded Supabase imports in all survey controllers — use factory instead

## 7. Backend: Email Scheduling with Bull (tests first)

- [x] 7.1 Write tests for Bull queue integration — job enqueue, delay, retry — `src/services/surveyEmailScheduler.spec.ts`
- [x] 7.2 Implement `src/services/surveyEmailScheduler.ts` — enqueue `send-survey-email` job with 24h delay
- [x] 7.3 Write tests for Bull worker — `src/services/surveyEmailWorker.spec.ts`
- [x] 7.4 Implement `src/services/surveyEmailWorker.ts` — process job: load template, send via Nodemailer, save notification
- [x] 7.5 Write tests for email template loader — `src/services/emailTemplateService.spec.ts`
- [x] 7.6 Implement `src/services/emailTemplateService.ts` — load and render HTML templates
- [x] 7.7 Create `src/email-templates/survey-invitation.html` — HTML template with branding, volunteer name, survey link
- [x] 7.8 Write tests for notification storage — `src/services/notificationService.spec.ts`
- [x] 7.9 Implement notification storage (in-memory for dev, persisted for staging/production)
- [x] 7.10 Wire Bull worker startup into `src/index.ts`
- [x] 7.11 Write integration test: contract creation → job enqueued → worker sends email

## 8. Backend: Wire Email Scheduling into Contract Flow

- [x] 8.1 Write test: `contractController` enqueues email after successful contract creation
- [x] 8.2 Modify `src/api/controllers/contractController.ts` to call `surveyEmailScheduler` after contract creation
- [x] 8.3 Verify 24h delay is configurable via env var (with fallback to 24h)

## 9. Frontend: Pull Survey Pages from Remote

- [x] 9.1 Copy `src/app/encuesta/page.tsx` from `origin/dev` — server component that fetches questions
- [x] 9.2 Copy `src/app/encuesta/ClientRatingForm.tsx` from `origin/dev` — client-side form with star ratings
- [x] 9.3 Copy `src/app/encuesta/confirmacion/page.tsx` from `origin/dev` — thank you page
- [x] 9.4 Copy `src/components/ratings/star-rating.tsx` from `origin/dev` — star rating UI component
- [x] 9.5 Add survey API functions (`getAllQuestions`, `submitAnswer`) to frontend API layer
- [x] 9.6 Add `Question` type to `src/app/types.ts`

## 10. Frontend: Tests for Survey Pages

- [x] 10.1 Write Jest test for `ClientRatingForm` — render questions, rate all, submit
- [x] 10.2 Write Jest test for `StarRating` component — click star, hover, value change
- [x] 10.3 Write Jest test for survey API functions — mock fetch, verify payload
- [x] 10.4 Write Playwright e2e test: navigate to `/encuesta`, fill survey, submit, see confirmation

## 11. Integration & Smoke Tests

- [x] 11.1 Run full test suite on backend — `pnpm test` passes
- [x] 11.2 Run full test suite on frontend — `pnpm test` passes
- [x] 11.3 Run `pnpm run typecheck` on backend — no type errors
- [x] 11.4 Run `pnpm run typecheck` on frontend — no type errors
- [x] 11.5 Run `pnpm run lint` on both repos — no lint errors

## 12. Documentation

- [x] 12.1 Update `AGENTS.md` with new commands and patterns
- [x] 12.2 Add inline comments for Bull queue configuration (queue name, retry policy, delay config)
