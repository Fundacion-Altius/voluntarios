## 1. Test Infrastructure

- [x] 1.1 Create `e2e/helpers.ts` with shared utilities: `createContractAsAdmin`, `loginAs`, `randomId` helper functions
- [x] 1.2 Verify existing `page.route()` mocks still work and document the mock vs real pattern

## 2. Error State Tests

- [x] 2.1 Create `e2e/error-states.spec.ts` — test `GET /api/contracts` without auth header returns 401
- [x] 2.2 Test `GET /api/contracts/nonexistent-id` with valid admin token returns 404
- [x] 2.3 Test `GET /api/users/nonexistent-id` with valid admin token returns 404

## 3. CSRF Rejection Tests

- [x] 3.1 Create `e2e/csrf.spec.ts` — test POST `/api/contracts` without `X-CSRF-Token` header returns 403
- [x] 3.2 Test POST `/api/contracts` with a made-up `X-CSRF-Token` value returns 403

## 4. Contract Detail Tests

- [x] 4.1 Create `e2e/contract-detail.spec.ts` — admin creates a contract and fetches it by ID, assert 200 and matching ID
- [x] 4.2 Nave user fetches a Nave-area contract by ID, assert 200 and areas contains "Nave"

## 5. Role Enforcement Tests

- [x] 5.1 Create `e2e/role-enforcement.spec.ts` — nave user PUT `/api/contracts/:id` returns 403
- [x] 5.2 Nave user DELETE `/api/contracts/:id` returns 403
- [x] 5.3 General user GET `/api/users` returns 403
- [x] 5.4 General user POST `/api/users` returns 403

## 6. Pagination Tests

- [x] 6.1 Create `e2e/pagination.spec.ts` — verify response shape (data, total, page, pageSize, totalPages)
- [x] 6.2 Verify `?pageSize=5` limits data array to 5 items
- [x] 6.3 Create 25+ contracts, fetch `?page=2&pageSize=10`, verify correct slice

## 7. Sort Tests

- [x] 7.1 Create `e2e/sort.spec.ts` — verify `?sortBy=nombre&sortOrder=asc` returns ascending order
- [x] 7.2 Verify `?sortBy=nombre&sortOrder=desc` returns descending order
- [x] 7.3 Verify `?sortBy=invalidColumn` returns 400

## 8. Lugar Filter Tests

- [x] 8.1 Create `e2e/lugar-filter.spec.ts` — verify `?lugar=Madrid` returns only Madrid contracts
- [x] 8.2 Verify `?lugar=Madrid&lugar=Barcelona` returns contracts from either city

## 9. Real API Flow Test

- [x] 9.1 Create `e2e/real-flow.spec.ts` — browser opens `/`, fills multi-step form, submits with real API
- [x] 9.2 Verify success message "Tu contrato se ha enviado" appears
- [x] 9.3 Admin re-login and navigate to dashboard, verify new contract appears in table
- [x] 9.4 Verify PDF download button works and produces a `.pdf` file
- [x] 9.5 Tag test with `@real-api` and configure in playwright config to run separately
