## 1. Install Dependencies

- [x] 1.1 Add `vitest`, `vite`, `@vitest/coverage-v8` as devDependencies
- [x] 1.2 Add `vite-plugin-node` or configure Vite for Node.js CJS output
- [x] 1.3 Remove `jest`, `ts-jest`, `@types/jest` from devDependencies (supertest still needed)

## 2. Vite Build Configuration

- [x] 2.1 Create `vite.config.ts` targeting Node.js CommonJS output to `build/` directory
- [x] 2.2 Update `package.json` scripts: `build` → `vite build`, keep `dev` with nodemon/ts-node

## 3. Vitest Configuration

- [x] 3.1 Create `vitest.config.ts` with `globals: true`, Node environment, and `./src` roots
- [x] 3.2 Update `package.json` scripts: `test` → `vitest`, `test:w` → `vitest --watch`, `test:c` → `vitest --coverage`

## 4. Migrate Test Files

- [x] 4.1 Replace any `jest.*` references in spec files with `vi.*` equivalents — none found, all use standard globals
- [x] 4.2 Ensure `supertest` usage works with Vitest — no changes needed
- [x] 4.3 Delete `jest.config.js` and `setup-jest.ts`

## 5. Verify

- [x] 5.1 Run `npm test` — 36 pass, 1 pre-existing timeout (same as Jest)
- [x] 5.2 Run `npm run test:c` — coverage report generated
- [x] 5.3 Run `npm run build` — SSR build produces runnable `build/index.js`
- [x] 5.4 Smoke test: `node build/index.js` starts without errors
- [x] 5.5 Remove old Jest config files — `jest.config.js` and `setup-jest.ts` deleted
