## Why

Backend test coverage is at 32.19%, leaving core business logic (PDF generation), authentication flows, error handling, and the production data layer untested. This creates risk of regressions in critical paths.

## What Changes

- Add unit tests for `PDFGeneration.ts` and `pdfController.ts` (currently 0% function coverage)
- Increase `authController.ts` coverage to cover refresh token rotation, token blacklisting, and error paths
- Add unit tests for `errorHandler.ts` global error middleware
- Add unit tests for `src/db/index.ts` database initialization/dispatch
- Add mock-based unit tests for MariaDB and Supabase repositories
- Add unit tests for `questionController`, `surveyAnswerController`, `surveyController`, `surveySubmissionController` (four controllers with no tests)
- Add unit tests for `logger.ts`

## Capabilities

### New Capabilities
- `pdf-generation-unit-tests`: Unit tests for PDF generation logic and its API controller
- `auth-controller-unit-tests`: Unit tests for auth controller covering all branches (login, refresh, logout, error paths)
- `error-handler-unit-tests`: Unit tests for global Express error handler middleware
- `db-init-unit-tests`: Unit tests for database environment dispatch logic
- `repository-mock-tests`: Mock-based unit tests for MariaDB and Supabase repository implementations
- `survey-controllers-unit-tests`: Unit tests for question, survey, surveyAnswer, and surveySubmission controllers
- `logger-unit-tests`: Unit tests for the logger utility

### Modified Capabilities
- (none)

## Impact

- `voluntarios-back/src/PDFGeneration.ts`, `pdfController.ts`, `authController.ts`, `errorHandler.ts`, `db/index.ts`, `logger.ts`
- `voluntarios-back/src/infra/mariaDB/`, `src/infra/supabase/`
- `voluntarios-back/src/api/controllers/questionController.ts`, `surveyAnswerController.ts`, `surveyController.ts`, `surveySubmissionController.ts`
- No API or dependency changes — tests only
