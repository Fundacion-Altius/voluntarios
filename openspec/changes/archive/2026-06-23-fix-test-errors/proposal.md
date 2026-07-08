## Why

17 backend tests and 1 frontend test are failing, blocking development confidence and CI. The failures fall into three categories: auth middleware blocking API test requests, in-memory repository logic not returning correct `success` flags, and a frontend test query matching multiple elements.

## What Changes

- Fix `inMemoryUserRepository` to properly return `success: true` on `create`, `getById`, `upsert`, `update`, `updateRole`, `delete` operations
- Fix `roleMiddleware` to correctly call `res.status()` before `res.json()` when user is missing or role mismatches
- Fix API integration tests (`userApi`, `contractApi`) to properly authenticate requests via the auth middleware (login first or bypass auth)
- Fix contract API tests to correctly set up test contracts before testing
- Fix frontend login test to use `getAllByText` or scope query to avoid duplicate match

## Capabilities

### New Capabilities
- `none` — no new capabilities, this is a bug-fix-only change

### Modified Capabilities
- (none — internal implementation fixes, no spec-level behavior changes)

## Impact

- **`voluntarios-back/src/infra/inMemory/inMemoryUserRepository.ts`**: Fix create/upsert/update/delete to return `success: true`
- **`voluntarios-back/src/middleware/roleMiddleware.ts`**: Fix status code setting before json response
- **`voluntarios-back/src/api/contractApi.spec.ts`**: Authenticate requests properly
- **`voluntarios-back/src/api/userApi.spec.ts`**: Authenticate requests properly
- **`voluntarios-back/src/infra/inMemory/inMemoryUserRepository.spec.ts`**: Tests will pass after repo fix
- **`voluntarios-front/src/app/login/login.test.tsx`**: Fix ambiguous text query
