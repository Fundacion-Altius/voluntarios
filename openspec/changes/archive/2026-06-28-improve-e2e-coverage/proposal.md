## Why

The current Playwright E2E suite (7 files, 9 tests) covers role-based contract filtering and the mocked form flow well, but leaves critical paths untested: lugar/pagination/sort query params, error states (401/403/404/500), CSRF rejection, individual contract detail view, and role-enforcement on admin-only endpoints. These gaps allow regressions to slip through on real API calls.

## What Changes

- Add E2E tests for `?lugar=` query parameter filtering on `GET /api/contracts`
- Add E2E tests for pagination shape (`page`, `pageSize`, `total`, `totalPages`, `hasMore`)
- Add E2E tests for sort parameters (`sortBy`, `sortOrder`)
- Add E2E tests for error states: 401 (no token), 403 (wrong role), 404 (nonexistent resource), 500 (server error)
- Add E2E test for CSRF token rejection (POST/PUT/DELETE without valid `X-CSRF-Token`)
- Add E2E test for `GET /api/contracts/:id` (individual contract detail)
- Add E2E test for role enforcement (nave/general users receiving 403 on admin-only endpoints)
- Add a unified real E2E flow test (browser form submission without mocks → verify contract appears in dashboard)

## Capabilities

### New Capabilities

- `e2e-real-api-flow`: Unmocked browser test that creates a contract via the UI wizard and verifies it appears in the dashboard list and produces a downloadable PDF

### Modified Capabilities

- `e2e-testing`: Expand existing spec to cover lugar filtering, pagination, sort, error states, CSRF rejection, contract detail, and role enforcement

## Impact

- `voluntarios-front/e2e/` — new test files and/or expanded existing specs
- `voluntarios-back/` — no backend changes expected (all scenarios test existing behaviour)
- `playwright.config.ts` — potentially longer timeouts for the real-flow test
- No new dependencies
