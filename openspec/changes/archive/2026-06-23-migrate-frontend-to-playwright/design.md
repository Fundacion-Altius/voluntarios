## Context

The frontend has two testing layers: Jest unit/component tests (2 files, 13 tests) and Cypress E2E tests (1 file, 1 active test). The Cypress test is a monolithic 145-line script that walks through the entire contract flow (form → signature → consent → submit → PDF download) with mocked API intercepts. Cypress adds complexity: a legacy plugins file, `chai-string` dependency, separate TypeScript config, and slower execution compared to Playwright.

## Goals / Non-Goals

**Goals:**
- Replace Cypress with Playwright for E2E testing
- Rewrite the single monolithic Cypress test into smaller, focused Playwright test scenarios
- Achieve equivalent or better coverage of the contract generation flow
- Remove Cypress dependencies, config, and the `cypress/` directory
- Add Playwright scripts to `package.json`

**Non-Goals:**
- No changes to Jest unit/component tests
- No changes to application code
- No changes to the backend or its tests

## Decisions

- **Use Playwright's built-in test runner**: No additional test framework needed — `@playwright/test` provides describe/it/expect with native async support.
- **Use Playwright's web-first assertions**: Replace `chai-string` custom matchers with `expect(locator).toContainText()` and Playwright's built-in auto-waiting.
- **Break the monolithic test into scenarios**: Separate tests for form filling, signature, consent, and PDF download — improving debuggability and parallel execution.
- **Use `page.route()` for API mocking**: Playwright's `page.route()` replaces Cypress's `cy.intercept()`, intercepting backend API calls to `localhost:3001`.
- **Keep Chromium-only for now**: Playwright supports Chromium, Firefox, and WebKit. The initial migration targets Chromium (matching Cypress's default), with easy expansion later.

## Risks / Trade-offs

- **[Canvas signature test]** The Cypress test draws on a canvas element. Playwright handles canvas via `page.evaluate()` similarly. → Mitigation: Verify the signature test works by checking canvas pixel data after drawing.
- **[PDF download assertion]** Cypress uses a custom `cy.task` to read the downloads folder. Playwright handles downloads natively via `page.waitForEvent('download')`. → Mitigation: Use Playwright's download event API for cleaner assertions.
- **[E2E environment setup]** The E2E test depends on both the frontend (localhost:3000) and backend (localhost:3001) running. → Mitigation: Document in README or add a `test:e2e` script comment noting the prerequisites.
