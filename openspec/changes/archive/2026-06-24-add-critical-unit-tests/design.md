## Context

Current test coverage is 32.19%. The vitest config excludes `src/infra/mariaDB` and `src/infra/supabase` entirely from the test runner. Existing tests use Vitest with `vi.mock()` for mocking (see `authMiddleware.spec.ts`) and Supertest for API-level integration tests (see `authApi.spec.ts`). In-memory repositories are already tested directly.

All new tests should follow the existing patterns: Vitest with `vi.fn()`/`vi.mock()`, no jsdom (node environment), and the `@/` path alias.

## Goals / Non-Goals

**Goals:**
- Achieve >80% function coverage on `PDFGeneration.ts`, `pdfController.ts`, `errorHandler.ts`, `authController.ts`, `logger.ts`, `db/index.ts`
- Add unit tests for all four survey controllers (question, survey, surveyAnswer, surveySubmission)
- Enable mock-based unit tests for MariaDB and Supabase repositories by running them in the test suite

**Non-Goals:**
- Integration tests requiring a running database (MariaDB/Supabase)
- E2E or contract tests (already covered by Playwright/API specs)
- Frontend test changes
- Refactoring production code to make it testable

## Decisions

1. **Mock Drizzle/DB layer for repository tests** — Use `vi.mock('drizzle-orm/mysql2')` and `vi.mock('postgres')` to mock the DB layer rather than requiring a real database. This keeps tests fast and hermetic. Alternative (spinning up testcontainers) was rejected for complexity.

2. **Mock pdf-lib for PDF generation tests** — Use `vi.mock('pdf-lib')` to avoid heavyweight PDF rendering in unit tests. Focus on verifying the function is called with correct arguments and the final byte output is as expected.

3. **Direct controller unit tests (not via HTTP)** — Instead of Supertest for controller-level tests, call controller functions directly with mocked `req`/`res`/`next` objects (same pattern as `authMiddleware.spec.ts`). This is faster and isolates the logic.

4. **Remove exclusion for MariaDB/Supabase spec files** — Update `vitest.config.ts` to remove the exclusion of `src/infra/mariaDB` and `src/infra/supabase` so their spec files run. The specs must use mocks rather than real DB connections.

5. **Keep existing in-memory tests as-is** — The existing in-memory repository tests are working and provide good coverage for the in-memory path. No changes needed.

## Risks / Trade-offs

- [Mock fidelity] Mocking Drizzle means tests trust that Drizzle works correctly. Mitigation: integration tests (API specs via Supertest) cover the full stack with in-memory repos.
- [PDF Generation] Mocking `pdf-lib` means we don't validate actual PDF output. Mitigation: add a single smoke test that generates a real PDF (small, no external deps) to validate byte output.
- [MariaDB/Supabase exclusions] Removing the exclusion could cause CI failures if mock setup is incomplete. Mitigation: add specs gradually, verifying each one passes before removing exclusion.
