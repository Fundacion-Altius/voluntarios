## Why

The frontend E2E tests currently use Cypress (a single monolithic test in `cypress/e2e/`). Playwright offers faster execution, native cross-browser support, better async handling, and a simpler configuration — while removing the dependency on `chai-string` and the legacy Cypress plugin setup.

## What Changes

- Replace Cypress with Playwright for E2E testing
- Add `@playwright/test` and configure `playwright.config.ts`
- Rewrite the existing Cypress E2E test (`generate-contract.spec.cy.ts`) as Playwright tests, broken into focused scenarios
- Remove Cypress dependencies: `cypress`, `@types/cypress`, `chai-string`, `@types/chai`
- Delete Cypress config: `cypress.config.ts`, `cypress/` directory
- Update `package.json` scripts: remove `cypress:open`/`cypress:run`, add `test:e2e` / `test:e2e:ui`

## Capabilities

### New Capabilities
- `e2e-testing`: E2E tests that verify the full contract generation flow — form fill, signature, consent checkboxes, contract submission, and PDF download — against a running frontend and backend.

### Modified Capabilities
- None. This is a tooling replacement with equivalent coverage.

## Impact

- New file: `playwright.config.ts`
- Removed: `cypress/` directory (config, e2e tests, support files, plugins, fixtures)
- `package.json` — scripts and devDependencies change
- `tsconfig.json` / `cypress/tsconfig.json` — remove Cypress type references
- Jest unit/component tests are **not** affected
