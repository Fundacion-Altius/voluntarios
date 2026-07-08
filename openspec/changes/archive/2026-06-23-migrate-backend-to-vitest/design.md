## Context

The backend is an Express.js API compiled with `tsc` (CommonJS output) and tested with Jest + `ts-jest`. `ts-jest` performs full TypeScript compilation on every test run, which is slow. `tsc` builds the entire project serially. Both tools lack native ESM handling and esbuild/SWC integration.

Moving to Vite + Vitest leverages esbuild transforms for near-instant compilation, native ESM support, and a Jest-compatible API for zero-rewrite test migration.

## Goals / Non-Goals

**Goals:**
- Replace `tsc` build with `vite build` for faster production builds
- Replace Jest + ts-jest with Vitest for faster test execution
- Preserve all existing test coverage and functionality
- Keep CommonJS output for runtime compatibility (Node.js, MariaDB driver)
- Maintain the existing `nodemon` dev workflow

**Non-Goals:**
- No changes to application code logic, API contracts, or database interactions
- No migration to ESM output at runtime
- No changes to CI/CD pipelines (beyond script updates)
- No changes to the frontend

## Decisions

- **Use `vite-plugin-node` or `vite.config.ts` with `build.lib` + `build.rollupOptions`**: Configure Vite to output CommonJS targeting Node.js. This avoids forcing ESM on the existing codebase. Vite's esbuild-based transpilation will handle the `import` -> `require` conversion.
- **Vitest with `globals: true`**: Enable global test functions (`describe`, `it`, `expect`) to match Jest's global API, minimizing test file changes.
- **Use `vi` over `jest` mocks**: Replace `jest.fn()`, `jest.mock()`, etc. with Vitest's `vi.fn()`, `vi.mock()` equivalents.
- **Keep `tsc --noEmit` as a type-check script**: Optionally add a `typecheck` script for strict type verification in CI.
- **No SWC plugin for Vitest**: The default vite-node/esbuild transform is fast enough; SWC adds complexity without significant gain for this project size.

## Risks / Trade-offs

- **[Vite Node.js compatibility]** Vite is primarily designed for browser bundling. Node.js-specific features (require, __dirname, process.env) may need polyfills or configuration. → Mitigation: Use `vite-plugin-node` or configure `build.rollupOptions.output.format: 'cjs'` with appropriate externals.
- **[Vitest API differences]** Some Jest APIs may differ subtly in Vitest (e.g., `jest.spyOn` vs `vi.spyOn`, auto-mocking behavior). → Mitigation: Audit test files after migration; run full test suite before completing.
- **[MariaDB/Supabase integration tests]** These tests hit real databases. Vitest's concurrent runner may cause flakiness. → Mitigation: Keep `sequence: true` or `pool: singleThread` for test files that use database connections.
- **[Build output differences]** Vite may produce different bundled output than tsc, potentially affecting `globalThis`, `__dirname`, or module interop. → Mitigation: Smoke-test the built app after migration with `node build/index.js`.
