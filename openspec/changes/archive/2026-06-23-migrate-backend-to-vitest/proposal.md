## Why

The backend currently uses `tsc` for building (slow, full compilation) and Jest with `ts-jest` for testing (slow transpilation). Migrating to Vite (via `vite build`) and Vitest provides significantly faster builds and test runs through native ESM handling, SWC/esbuild transforms, and hot-module reload capabilities — speeding up the developer feedback loop.

## What Changes

- Replace `tsc` build with `vite build` (using `vite-plugin-node` or `vite-plugin-node-polyfills` for Node.js target)
- Replace Jest + ts-jest with Vitest (drops-in compatible Jest API)
- Add `vitest.config.ts` and `vite.config.ts` configuration files
- Remove Jest, ts-jest, and related type definitions from devDependencies
- Update `package.json` scripts: `build`, `test`, `test:w`, `test:c`, `dev`
- Add `@vitest/coverage-v8` for test coverage (replacing jest --coverage)
- Keep `tsc` as a type-check-only step (optional, via `tsc --noEmit`)

## Capabilities

### New Capabilities
- `build-and-test`: The build pipeline compiles TypeScript to a runnable Node.js application, and the test runner executes both unit and integration tests with fast feedback, coverage reporting, and watch mode.

### Modified Capabilities
- None. This change only affects tooling, not application behavior.

## Impact

- `package.json` — scripts and devDependencies change
- New files: `vite.config.ts`, `vitest.config.ts`
- Removed files: `jest.config.js` (replaced by vitest config)
- Test files: Minor import/type adjustments may be needed for Vitest compatibility (`vi` vs `jest`, globals)
- `tsconfig.json` — may need adjustments for Vite's module resolution
- `src/index.ts` — may need minor adjustments for Vite's CJS/ESM handling in tests
- No impact on runtime behavior, API contracts, or database schema
