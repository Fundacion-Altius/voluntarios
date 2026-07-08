## Why

Volunteers currently sign contracts with Fundación Altius, but there's no feedback loop. The platform already has survey pages and backend code on remote branches (`dev`, `build`) that were never merged or wired. We need to bring those features into production and add the missing bridge: a 24-hour delayed email that invites volunteers to fill out an anonymous survey after signing.

## What Changes

- **Pull survey feature from remote branches** — reuse existing survey backend schemas, controllers, Supabase repos, and frontend pages, adapting them to the current codebase without breaking anything
- **Add notification scheduling** — when a contract is signed, schedule an email to be sent 24 hours later with a survey link
- **Add email sending** — implement the Nodemailer-based email service with a survey invitation template
- **Wire the survey routes** — register survey HTTP endpoints that exist as code but are not connected to Express
- **Fix bugs in existing survey code** — race condition in `submitSurvey` (uses `.at(-1)` to get submission ID) and hardcoded Supabase dependencies
- **Add missing repository implementations** — in-memory survey repos for development, MariaDB survey repos for staging
- **TDD approach** — write tests before implementation for all new code

## Capabilities

### New Capabilities

- `survey-crud`: CRUD operations for surveys, questions, answers, and submissions
- `survey-submission`: Anonymous survey submission with star ratings and optional text
- `delayed-email`: Schedule and send emails with a configurable delay after contract signing
- `email-templates`: HTML email templates for survey invitations

### Modified Capabilities

No existing specs are being modified.

## Impact

**Backend (`voluntarios-back/`)**:
- New routes: `/api/surveys/*`, `/api/surveys/submit-answer`, `/api/surveys/get-report`
- New dependency: `bull` (already in `package.json`, needs wiring) + Redis
- New files: survey routes, in-memory survey repos, MariaDB survey repos, notification scheduling service, email templates
- Modified files: `src/api/routes/index.ts` (add survey routes), `src/index.ts` (start Bull worker), `src/api/controllers/contractController.ts` (trigger scheduled email after contract creation)
- Test files: new test suites for surveys, notifications, scheduling

**Frontend (`voluntarios-front/`)**:
- New pages: `/encuesta` (survey form), `/encuesta/confirmacion` (thank you)
- New components: `ClientRatingForm`, `StarRating`
- New API calls: `getAllQuestions()`, `submitAnswer()`
- No breaking changes to existing pages or contract wizard

**Infrastructure**:
- Redis required for Bull job queue (development: local Redis, production: managed Redis)
- SMTP configuration required for Nodemailer
- New environment variables: `REDIS_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `SURVEY_BASE_URL`
