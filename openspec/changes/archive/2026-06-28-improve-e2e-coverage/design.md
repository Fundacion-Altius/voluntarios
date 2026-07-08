## Context

The current E2E suite (7 files, 9 tests) lives in `voluntarios-front/e2e/` and uses Playwright with chromium. Tests authenticate against the real staging backend (`http://localhost:3001`) or use `page.route()` mocks. The suite already has a `page.route()` pattern in `contract-flow.spec.ts`, an auth helper pattern in the role-based specs, and a diagnostic logger in `login-diagnostic.spec.ts`.

The new tests will follow existing conventions: real API calls for auth and contract CRUD (requiring the staging backend to be running), and `page.route()` mocks only for the unified browser flow that must work without a backend.

## Goals / Non-Goals

**Goals:**
- Cover every untested API endpoint with at least one positive and one negative scenario
- Verify pagination, sort, lugar filter, and error states work correctly on the real staging backend
- Test CSRF rejection for state-changing requests without a valid token
- Verify role enforcement: nave/general users receive 403 on admin-only PUT/DELETE contract endpoints and user management endpoints
- Add one unified browser test that creates a contract via the real UI wizard and verifies it in the dashboard (unmocked)

**Non-Goals:**
- Backend changes — all tests exercise existing behaviour
- Performance/load testing
- Visual regression testing
- Mobile browser testing beyond what already exists

## Decisions

1. **File organization**: Create focused test files by concern (e.g., `pagination.spec.ts`, `error-states.spec.ts`, `csrf.spec.ts`, `contract-detail.spec.ts`, `role-enforcement.spec.ts`, `real-flow.spec.ts`) rather than ballooning existing files. Keeps each file's responsibility clear and results readable.

2. **Test data isolation**: Each test file creates its own contracts as needed and cleans them up via DELETE. Use the existing admin seed credentials (`admin@fundacionaltius.org` / `admin123`) for setup/teardown. This follows the pattern already established in `admin-contracts.spec.ts`.

3. **Error state tests require no seed data**: 401 tests omit the `Authorization` header; 403 tests log in as nave/general and hit admin endpoints; 404 tests use a nonexistent UUID. This makes them independent and deterministic.

4. **CSRF test approach**: Make a POST with a made-up CSRF token, expect 403. The existing middleware already validates `X-CSRF-Token` — this just verifies the rejection path works end-to-end.

5. **Real flow test**: Use `page.route()` only to stub `GET /api/contracts/:id` (which has no real dashboard integration yet), but let all other API calls hit the real backend. This is the inverse of the existing mocked flow — it validates the full integration chain.

6. **Timeout adjustments**: The real-flow test may need a longer timeout (60s vs default 30s) because it waits for the backend to process each step. Use Playwright's `test.setTimeout()` per-file.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Flakiness from shared DB state**: Role-enforcement and pagination tests create contracts that persist between runs. Stale data could cause false failures. | Use unique contract IDs with timestamps and cleanup in `afterAll`. Pagination tests should also `deleteAll` (admin-only) at the start to ensure a known state. |
| **Staging backend dependency**: Error-state, pagination, and sort tests require the staging MariaDB backend (`pnpm run staging`). CI without a DB will skip these. | Document that `test:e2e` requires a running backend. The existing suite already has this dependency — no net change. |
| **CSRF test could be brittle**: If CSRF middleware changes (e.g., per-session tokens), the hardcoded fake token test may need updating. | Test only the rejection path — any valid CSRF check that rejects a bad token will work. Keep the test focused on "403 expected", not token format. |
| **Real flow test is slow**: Browser navigation + real API calls could take 30-60s. | Tag with `@real-api` and run separately in CI. Default suite excludes it. |

- **Auth flow reuse**: Role-enforcement tests can use the existing `nave` and `general` seed users (`nave@fundacionaltius.org`, `general@fundacionaltius.org`). No new user creation needed.
- **Pagination test setup**: Create 25+ contracts upfront to guarantee at least 2 pages (pageSize defaults to 20). Clean up after.
