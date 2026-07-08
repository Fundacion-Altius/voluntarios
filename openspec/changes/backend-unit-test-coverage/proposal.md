## Why

`contractController.ts` (159 lines) and `userController.ts` (167 lines) have zero unit tests — their only coverage comes from happy-path supertest API tests, leaving error handling, RBAC branching, and role management endpoints entirely untested. Security-critical `csrfUtils.ts` and foundational `validate.ts` also lack isolated tests.

## What Changes

- Add unit tests for `contractController` (all 5 handlers: getAllContracts, getContractById, createContract, updateContract, deleteContract) using in-memory repositories
- Add unit tests for `userController` (all 9 handlers: getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserRole, getUserRoles, addUserRole, removeUserRole, getMe) using in-memory repositories
- Add unit tests for `csrfUtils` (generateCSRFToken, validateCSRFToken, csrfMiddleware) — no mocks, test real crypto
- Add unit test for `validate` middleware (Zod schema validation)
- Add integration tests for contract controller scenarios that require complex DB queries (paginated queries with role-based filtering)
- No modifications to existing code — tests only

## Capabilities

### New Capabilities
- `contract-controller-tests`: Unit tests for `contractController.ts` using in-memory repos. Integration tests for paginated/role-filtered queries using dockerized Postgres.
- `user-controller-tests`: Unit tests for `userController.ts` (all 9 handlers + role validation) using in-memory repos.
- `security-utils-tests`: Unit tests for `csrfUtils.ts` (token generation, validation middleware, exempt paths) and `validate.ts` (Zod schema validation middleware).

### Modified Capabilities
<!-- No spec-level behavior changes — all changes are additive (tests only). -->

## Impact

- `src/api/controllers/contractController.spec.ts` — new unit test file
- `src/api/controllers/userController.spec.ts` — new unit test file
- `src/api/controllers/contractController.integration.test.ts` — new integration test file (if needed for paginated/RBAC scenarios)
- `src/utils/csrfUtils.spec.ts` — new unit test file
- `src/middleware/validate.spec.ts` — new unit test file
- No new dependencies. Tests use existing Vitest + in-memory repos (unit) or dockerized Postgres (integration).
