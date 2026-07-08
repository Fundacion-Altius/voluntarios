## 1. Install Playwright

- [x] 1.1 Add `@playwright/test` as a devDependency
- [x] 1.2 Install Playwright browsers: `npx playwright install chromium`

## 2. Playwright Configuration

- [x] 2.1 Create `playwright.config.ts` with Chromium target, localhost:3000 base URL, and API mocking

## 3. Write Playwright E2E Tests

- [x] 3.1 Create `e2e/` directory and `e2e/contract-flow.spec.ts` with form fill test scenario
- [x] 3.2 Add signature canvas test scenario
- [x] 3.3 Add consent checkboxes and contract submission scenario
- [x] 3.4 Add PDF download verification scenario
- [x] 3.5 Add API route mocking via `page.route()`

## 4. Remove Cypress

- [x] 4.1 Delete `cypress/` directory (config, e2e, support, plugins, fixtures)
- [x] 4.2 Remove `cypress`, `@types/cypress`, `chai-string`, `@types/chai` from devDependencies
- [x] 4.3 Remove Cypress type references from `tsconfig.json` (if any) and delete `cypress/tsconfig.json`

## 5. Update Package Scripts

- [x] 5.1 Add `test:e2e` and `test:e2e:ui` scripts to `package.json`
- [x] 5.2 Remove `cypress:open` and `cypress:run` scripts

## 6. Verify

- [x] 6.1 Run `npx playwright test` — all E2E tests pass
- [x] 6.2 Run `npm test` — Jest unit tests still pass (no regressions)
- [x] 6.3 Run `npm run lint` — no lint errors
