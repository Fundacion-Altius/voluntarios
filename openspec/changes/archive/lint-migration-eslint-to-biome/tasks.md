## 1. Install Biome and Remove ESLint + Prettier

- [x] 1.1 Install `@biomejs/biome` as a devDependency
- [x] 1.2 Remove all ESLint-related devDependencies (`eslint`, `@eslint/js`, `typescript-eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-import`, `eslint-plugin-n`, `eslint-plugin-prettier`, `eslint-plugin-promise`, `eslint-config-prettier`)
- [x] 1.3 Remove all Prettier-related devDependencies (`prettier`, `prettier-eslint`, `prettier-eslint-cli`)
- [x] 1.4 Delete `eslint.config.mjs`
- [x] 1.5 Delete `eslintrc.json`

## 2. Create Biome Configuration

- [x] 2.1 Run `pnpm biome init` to generate `biome.json`
- [x] 2.2 Configure `linter.rules.suspicious.noExplicitAny` to `"off"`
- [x] 2.3 Configure `linter.rules.correctness.noUnusedVariables` to `"off"`
- [x] 2.4 Configure `files.ignore` to include `build/`, `coverage/`, `setup-jest.ts`, `*.spec.ts`, `*.test.ts`, `drizzle.config.ts`, `vite.config.ts`, `vitest.config.ts`, `vitest.integration.config.ts`
- [x] 2.5 Set `formatter.indentStyle` to match existing code style (check current files)
- [x] 2.6 Set `formatter.lineWidth` to match project convention

## 3. Update npm Scripts and VSCode Config

- [x] 3.1 Update `lint` script to `biome check --write .`
- [x] 3.2 Add `format` script: `biome format --write .`
- [x] 3.3 Update or create `.vscode/settings.json` to set Biome as default formatter for JS/TS/TSX

## 4. Run Biome and Fix Codebase

- [x] 4.1 Run `pnpm biome check --write .` and commit auto-fixes
- [x] 4.2 Run `pnpm biome check --write --unsafe .` for additional fixes, review and commit
- [x] 4.3 Review remaining diagnostics manually and fix or suppress
- [x] 4.4 Run `pnpm biome ci .` to verify zero diagnostics

## 5. Verify

- [x] 5.1 Run `pnpm run lint` and confirm it succeeds with no errors
- [x] 5.2 Run `pnpm run format` and confirm it formats without error
- [x] 5.3 Run `pnpm run typecheck` to ensure no type regressions
- [x] 5.4 Run `pnpm test` to ensure all tests still pass (3 pre-existing failures confirmed)
- [x] 5.5 Run `pnpm run build` to ensure build succeeds
- [x] 5.6 Update AGENTS.md with new lint/format commands
