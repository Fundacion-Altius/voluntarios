## Context

Vitest (backend) and Jest (frontend) test suites have 18 failing tests total. Root causes fall into 3 categories:

- **CSRF middleware blocking state-changing requests** in API integration tests (`userApi.spec.ts`, `contractApi.spec.ts`) — global `csrfMiddleware` in `index.ts` checks `X-CSRF-Token` header against `csrf_token` cookie for POST/PUT/DELETE; API tests don't set these up.
- **Test/implementation type mismatch** in `inMemoryUserRepository.spec.ts` — tests construct `User` objects with `id`/`name` but the `User` interface defines `user_id`/`display_name`, causing `getById` (which searches by `user_id`) to always return `{ success: false }`.
- **Environment interference** in `roleMiddleware.spec.ts` — vitest config sets `BYPASS_AUTH=true`, which makes the middleware call `next()` without ever touching `res.status()`, so assertions on `res.status` fail.
- **Ambiguous DOM query** in frontend `login.test.tsx` — `getByText('Iniciar sesión')` matches both the card title and the submit button.

## Goals / Non-Goals

**Goals:**
- Fix all 18 failing tests (17 backend + 1 frontend)
- Ensure tests accurately reflect the code they test

**Non-Goals:**
- No new features or refactoring beyond what's needed for tests to pass
- No changes to production behavior or data model
- No changes to CI/CD configuration

## Decisions

1. **Fix repository tests by aligning with the `User` type, not the other way around.**
   - The test constructs objects with `id`/`name` but the `User` type uses `user_id`/`display_name`. Fix the test data to match the real type. The repository implementation is correct.
   - `getAll()` already returns `stripPassword` (omits `passwordHash`), so assertions on equality must account for this.

2. **Fix roleMiddleware tests by overriding `BYPASS_AUTH` per-test.**
   - Use `vi.stubEnv('BYPASS_AUTH', 'false')` before each test and `vi.unstubAllEnvs()` after.
   - Also fix the `requireRole` call in "should support multiple roles" to pass an array `['admin', 'nave']` instead of two separate arguments.

3. **Fix API integration tests by adding CSRF token handling.**
   - Make a GET request to obtain the `csrf_token` cookie, then include `X-CSRF-Token` header and cookie on state-changing requests.
   - This mirrors how `authApi.spec.ts` already handles CSRF.

4. **Fix login test by using `getByRole` for the button.**
   - Use `screen.getByRole('button', { name: 'Iniciar sesión' })` to be specific about the element type.

## Risks / Trade-offs

- Adding CSRF token fetching to API tests adds a small amount of boilerplate but is necessary since CSRF middleware is global.
- The `stripPassword` behavior in the repository means tests cannot directly `toEqual` the created object (since `passwordHash` is stripped). Tests that don't set `passwordHash` won't be affected.
