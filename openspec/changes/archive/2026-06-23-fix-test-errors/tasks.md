## 1. Fix inMemoryUserRepository tests (type mismatch)

- [x] 1.1 Update test objects to use `user_id`/`display_name` instead of `id`/`name`
- [x] 1.2 Update `getById` equality assertions to account for `stripPassword` removal of `passwordHash`

## 2. Fix roleMiddleware tests (BYPASS_AUTH interference)

- [x] 2.1 Add `vi.stubEnv`/`vi.unstubAllEnvs` around BYPASS_AUTH in each test
- [x] 2.2 Fix "should support multiple roles" to pass array `['admin', 'nave']` instead of two args

## 3. Fix API integration tests (CSRF missing)

- [x] 3.1 Add `getCSRFToken` helper to `userApi.spec.ts` and set cookie+header on POST/PUT/DELETE
- [x] 3.2 Add `getCSRFToken` helper to `contractApi.spec.ts` and set cookie+header on POST/DELETE

## 4. Fix frontend login test (ambiguous query)

- [x] 4.1 Change `getByText('Iniciar sesión')` to use `getByRole('button', { name: 'Iniciar sesión' })` or equivalent scoped query

## 5. Verify all tests pass

- [x] 5.1 Run `pnpm test` in backend and confirm 0 failures
- [x] 5.2 Run `pnpm test` in frontend and confirm 0 failures
