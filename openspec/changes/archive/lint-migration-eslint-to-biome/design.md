## Context

The `voluntarios-back` package currently has 14 ESLint + Prettier devDependencies, two config files (`eslint.config.mjs` for flat config, `eslintrc.json` as legacy), and a lint script that runs `eslint --fix .`. Two ESLint rules (`@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`) are explicitly disabled — the new Biome config must preserve that policy.

Existing ESLint flat config (`eslint.config.mjs`):
- Ignores `build/`, `coverage/`, test files, `drizzle.config.ts`, `vite/vitest configs`
- JS files: ESLint recommended rules
- TS files: `typescript-eslint` recommended rules with `no-explicit-any`, `no-unused-vars`, `no-var-requires`, `no-undef` disabled
- CommonJS files (`commitlint.config.js`, `jest.config.js`): `sourceType: 'commonjs'`

## Goals / Non-Goals

**Goals:**
- Replace ESLint + Prettier with Biome as the single lint + format tool
- Remove all ESLint and Prettier devDependencies
- Remove both ESLint config files; create `biome.json` with equivalent configuration
- Preserve disabled rules (no-explicit-any, no-unused-vars)
- Preserve ignore patterns
- Update `pnpm run lint` to use Biome
- Run Biome on the entire codebase and fix all issues

**Non-Goals:**
- Changing the commitlint setup (unrelated to ESLint)
- Migrating the frontend package (separate change)
- Enabling new lint rules beyond what Biome defaults provide
- Changing build or test tooling

## Decisions

1. **Use `biome check` instead of separate `lint` + `format` commands for the lint script**
   Biome `check` runs both linting and formatting in one pass, replacing ESLint + Prettier. The `--write` flag applies auto-fixes. A separate `format` script is added for formatting-only runs.

2. **Disable `noExplicitAny` and `noUnusedVariables` in Biome config**
   These mirror the currently disabled ESLint rules. Using `lint/suspicious/noExplicitAny = "off"` and `lint/correctness/noUnusedVariables = "off"` in `biome.json`.

3. **Use Biome's `files.ignore` for the same ignores as ESLint**
   ESLint's `ignores` list (`build/`, `coverage/`, test files, config files) is replicated via `files.ignoreUnused` and/or `files.include` in `biome.json`.

4. **Handle mixed JS/TS config files via Biome's `overrides`**
   Instead of per-file-type config, Biome will use `overrides` with `include` for `.js` files that need different parser settings if needed, though Biome handles JS and TS uniformly by default.

5. **Run migration in a single pass per file**
   Biome's `check --write --unsafe` catches all auto-fixable issues. Remaining issues after that are reviewed manually. This avoids splitting migration into format-then-lint phases.

## Risks / Trade-offs

- [Risk] Biome may not catch all patterns that `typescript-eslint` caught → Mitigation: Manual review of remaining diagnostics after auto-fix
- [Risk] CI lint step may fail with new errors post-migration → Mitigation: Run Biome in CI with `--max-diagnostics 0` to surface all issues, fix before merge
- [Risk] Developer muscle memory for ESLint commands → Mitigation: Document new commands in AGENTS.md and add `format` script
- [Risk] `no-undef` is disabled in current ESLint config — Biome doesn't have a direct equivalent → Mitigation: Acceptable, TypeScript's `noEmit` catches true undefined references at compile time
