## 1. Contract Controller Unit Tests (`contractController.spec.ts`)

- [ ] 1.1 Create test file with env setup: set `process.env.KEY` via `vi.hoisted()`, mock `surveyEmailScheduler` to avoid real timers
- [ ] 1.2 Import real in-memory repos (`inMemoryContractRepository`, `inMemoryUserRepository`) and call `deleteAll()` in `beforeEach`
- [ ] 1.3 Implement `getAllContracts` tests: admin paginated, nave role filter, general role filter, invalid sortBy 400, no-paginate fallback, repository error 500
- [ ] 1.4 Implement `getContractById` tests: admin gets existing contract 200, non-existent 404, nave accesses non-nave 403, general accesses nave 403
- [ ] 1.5 Implement `createContract` tests: valid contract creates contract+user+schedules email 201, repository error 500
- [ ] 1.6 Implement `updateContract` tests: existing contract 200, non-existent 404
- [ ] 1.7 Implement `deleteContract` tests: successful delete 204, non-existent 404, repo failure 500

## 2. User Controller Unit Tests (`userController.spec.ts`)

- [ ] 2.1 Create test file, import real `inMemoryUserRepository`, call `deleteAll()` in `beforeEach`, seed test users per suite
- [ ] 2.2 Implement `getAllUsers` tests: admin sees all, non-admin sees same-role users only, repository error 500
- [ ] 2.3 Implement `getUserById` tests: existing user 200, non-existent 404
- [ ] 2.4 Implement `createUser` tests: valid with all fields 201, defaults when optional fields omitted 201
- [ ] 2.5 Implement `updateUser` tests: existing user success 200, non-existent failure 200, repository error 500
- [ ] 2.6 Implement `deleteUser` tests: existing user 204, non-existent failure 200, repository error 500
- [ ] 2.7 Implement `updateUserRole` tests: valid role update 200, invalid role 400, non-existent user 404
- [ ] 2.8 Implement `getUserRoles` tests: user with roles 200, user without roles 404
- [ ] 2.9 Implement `addUserRole` tests: valid role 200, invalid role 400
- [ ] 2.10 Implement `removeUserRole` tests: valid removal 200, invalid role 400, user without roles 400
- [ ] 2.11 Implement `getMe` tests: authenticated user 200, unauthenticated 401

## 3. Security Utils Unit Tests (`csrfUtils.spec.ts` + `validate.spec.ts`)

- [ ] 3.1 Create `csrfUtils.spec.ts`, test `generateCSRFToken`: returns 64-char hex, unique tokens
- [ ] 3.2 Test `validateCSRFToken`: safe methods call next(), missing header 403, missing cookie 403, mismatch 403, match calls next()
- [ ] 3.3 Test `csrfMiddleware`: exempt paths call next(), no cookie generates one and calls next(), has cookie delegates to validateCSRFToken, cookie options respect env vars
- [ ] 3.4 Create `validate.spec.ts`: valid body calls next(), invalid body returns 400 with field errors, query source validates req.query

## 4. Verify

- [ ] 4.1 Run `pnpm test` — all new tests pass, no regressions
- [ ] 4.2 Run `pnpm run typecheck` — no type errors in test files
- [ ] 4.3 Run `pnpm run lint` — no lint issues
