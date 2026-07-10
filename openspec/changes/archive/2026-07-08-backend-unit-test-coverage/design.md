## Context

The backend has 32 spec files and 6 integration test files. Auth controller, survey controller, email services, and user/contract API routes all have tests, but `contractController.ts` (159 lines, 5 handlers) and `userController.ts` (167 lines, 9 handlers) have zero unit tests. Security-critical `csrfUtils.ts` and basic `validate.ts` middleware also lack isolated tests.

Existing controller tests (`authController.spec.ts`) use `vi.mock()` for the in-memory repo and for dependencies like bcrypt and JWT. This is fine for auth where all logic is stateless session management, but for CRUD controllers the pattern should use the real in-memory repos so we exercise actual data flow.

The repository factory (`infra/repositoryFactory.ts`) returns in-memory repos when `NODE_ENV=development`. In-memory repos (`inMemoryContractRepository`, `inMemoryUserRepository`) provide full CRUD with seed data and filtering — no external dependencies.

## Goals / Non-Goals

**Goals:**
- Unit tests for all contract controller handlers (getAllContracts, getContractById, createContract, updateContract, deleteContract) using real in-memory repos
- Unit tests for all user controller handlers (getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserRole, getUserRoles, addUserRole, removeUserRole, getMe) using real in-memory repos
- Unit tests for csrfUtils (generateCSRFToken, validateCSRFToken, csrfMiddleware) — real crypto, no mocks
- Unit tests for validate middleware (Zod schema validation) — no mocks
- Integration tests for contract controller scenarios requiring DB-level pagination/role-filtering with dockerized Postgres

**Non-Goals:**
- No modification to existing source code — tests only
- No new dependencies
- No changes to the repository factory, in-memory repos, or controller implementation
- No mocking of in-memory repos at the unit level
- No testing of the auth controller (already has coverage)

## Decisions

### 1. Use real in-memory repos directly for controller unit tests
- **Why:** The user requires unit tests use in-memory repos without mocking. This ensures test coverage exercises real CRUD logic, RBAC filtering, and error handling paths in the controllers. In-memory repos have zero external dependencies, so they run fast with no setup.
- **Pattern:** Test file imports `inMemoryContractRepository` or `inMemoryUserRepository` directly, calls `deleteAll()` in `beforeEach` to reset state, then seeds the repo with controlled data before each test. The controller handler is invoked with a mock `req`/`res` (Express-style objects created with `vi.fn()`).

### 2. Seed in-memory repos per test suite
- **Why:** The in-memory user repo starts with 4 seed records. Tests need specific data scenarios (user exists/doesn't exist, user is admin/nave/general, contract exists/doesn't exist). We call `deleteAll()` then `create()` in `beforeEach` for deterministic state.
- **Trade-off:** Overhead of seeding per test. Mitigated by small test count (~10-15 per suite) and fast in-memory operations.

### 3. Mock Express req/res objects with vi.fn()
- **Why:** Express request/response objects are complex and environment-dependent. Using `vi.fn()` for `status()`, `json()`, `send()` with `mockReturnThis()` chaining is the established pattern in authController specs and is simple.
- **Alternative considered:** Using `supertest` with a real Express app. Rejected because that would create integration-level coupling and require full Express setup. The authController pattern with mock req/res keeps tests fast and focused on controller logic.

### 4. csrfUtils tests use real crypto
- **Why:** `csrfUtils.ts` wraps `crypto.randomUUID()` for CSRF token generation and `crypto.timingSafeEqual()` for validation. These are standard Node crypto APIs — no mocking needed. Tests exercise real token generation and validation.
- **Implication:** Tokens are truly random, so we test structural properties (token is 36-char hex string, valid token passes, invalid token fails) rather than specific values.

### 5. validate middleware tests use real Zod schemas
- **Why:** The validate middleware wraps `schema.parse()` in a try/catch. Tests pass a dummy schema and exercise valid/invalid body scenarios. No mocking needed.

### 6. Integration tests for paginated/RBAC scenarios use dockerized Postgres
- **Why:** The in-memory contract repo implements `getPaginated()` with role filtering, so unit tests can cover basic pagination. For true integration-level testing (DB-level queries with complex joins), a dockerized Postgres container is used — matching the existing integration test pattern.
- **Where:** Only add integration E2E tests if the unit tests cannot adequately cover a scenario. Start with unit tests; evaluate integration needs during implementation.

## Risks / Trade-offs

- **Risk:** Using mock req/res objects may miss real Express behavior (e.g., body parsing, cookie parsing, middleware chaining). **Mitigation:** This is a deliberate contract — controller tests verify handler logic, not Express plumbing. Route-level behavior is covered by existing supertest API tests (`contractApi.spec.ts`).
- **Risk:** In-memory user repo has seed data that could leak between tests. **Mitigation:** Call `deleteAll()` in `beforeEach` and re-seed only the users needed for the test.
- **Risk:** The `contractController` uses `encryptAndCompress()` crypto function on contract data. **Mitigation:** Real encryption runs in tests, which is fine — it accepts any object and returns a string. No need to mock it.
