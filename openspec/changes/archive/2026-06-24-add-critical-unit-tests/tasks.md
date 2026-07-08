## 1. Vitest Configuration

- [x] 1.1 Remove `src/infra/mariaDB` and `src/infra/supabase` from vitest exclude list in `vitest.config.ts`
- [x] 1.2 Verify existing tests still pass after config change

## 2. Error Handler Unit Tests

- [x] 2.1 Create `src/middleware/errorHandler.spec.ts` testing DatabaseConnectionError returns 503
- [x] 2.2 Add test for generic Error returns 500
- [x] 2.3 Add test for unknown error types returns 500

## 3. Logger Unit Tests

- [x] 3.1 Create `src/logger.spec.ts` testing logger has info/warn/error methods
- [x] 3.2 Add test that logger writes to console without throwing

## 4. Database Init Unit Tests

- [x] 4.1 Create `src/db/index.spec.ts` testing `createMysqlDb` returns drizzle instance
- [x] 4.2 Add test for `getPgDb` lazy singleton pattern (same instance on repeated calls)

## 5. Auth Controller Unit Tests

- [x] 5.1 Create `src/api/controllers/authController.spec.ts` testing login with valid credentials
- [x] 5.2 Add test for login with invalid password returns 401
- [x] 5.3 Add test for login with non-existent email returns 401
- [x] 5.4 Add test for refresh with valid token issues new tokens
- [x] 5.5 Add test for refresh without cookie returns 401
- [x] 5.6 Add test for refresh with expired/invalid token returns 401
- [x] 5.7 Add test for logout blacklists tokens and clears cookies

## 6. PDF Generation Unit Tests

- [x] 6.1 Create `src/PDFGeneration.spec.ts` testing generatePDF returns valid PDF bytes
- [x] 6.2 Add test for generatePDF throwing on invalid contract data
- [x] 6.3 Create `src/api/controllers/pdfController.spec.ts` testing PDF endpoint returns 200 for valid contractId
- [x] 6.4 Add test for missing contractId returns 400
- [x] 6.5 Add test for non-existent contract returns 404
- [x] 6.6 Add test for PDF generation failure returns 500

## 7. MariaDB Repository Mock Tests

- [x] 7.1 Update `src/infra/mariaDB/mariaDBRepository.spec.ts` with vi.mock for drizzle-orm/mysql2
- [x] 7.2 Add test for getAll returning success with user list
- [x] 7.3 Add test for getById with existing and non-existing user
- [x] 7.4 Add test for create, update, delete operations
- [x] 7.5 Add test for database error handling

## 8. Supabase Repository Mock Tests

- [x] 8.1 Update `src/infra/supabase/supabaseRepository.spec.ts` with vi.mock for postgres
- [x] 8.2 Add test for getAll returning success with user list
- [x] 8.3 Add test for getById with existing and non-existing user
- [x] 8.4 Add test for database error handling

## 9. Survey Controllers Unit Tests

- [x] 9.1 Create `src/api/controllers/questionController.spec.ts` testing all CRUD handlers
- [x] 9.2 Create `src/api/controllers/surveyController.spec.ts` testing CRUD + submitSurvey
- [x] 9.3 Create `src/api/controllers/surveyAnswerController.spec.ts` testing all CRUD handlers
- [x] 9.4 Create `src/api/controllers/surveySubmissionController.spec.ts` testing all CRUD handlers

## 10. Final Verification

- [x] 10.1 Run `pnpm test --coverage` and verify overall coverage >70%
- [x] 10.2 Run `pnpm run typecheck` to ensure no type errors
- [x] 10.3 Run `pnpm run lint` to ensure no lint issues
