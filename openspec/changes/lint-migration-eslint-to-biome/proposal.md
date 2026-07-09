## Why

The backend currently depends on 14+ ESLint and Prettier packages with two config files (`eslint.config.mjs` and `eslintrc.json`), slow lint times due to TypeScript type-checking rules, and a fragile Prettier–ESLint integration. Biome provides a single binary, zero-config TypeScript/TSX support out of the box, and significantly faster lint+format performance. Migrating reduces maintenance burden, simplifies CI, and speeds up developer iteration.

## What Changes

- Replace ESLint (`eslint`, `@eslint/js`, `typescript-eslint`, etc.) + Prettier (`prettier`, `eslint-plugin-prettier`, etc.) with a single `@biomejs/biome` dependency
- Remove both ESLint config files (`eslint.config.mjs`, `eslintrc.json`) and create a single `biome.json` config
- Rewrite the `lint` npm script from `eslint --fix .` to `biome check --write .`
- Add `format` npm script for `biome format --write .`
- Suppress the two existing disabled ESLint rules (`no-explicit-any`, `no-unused-vars`) via Biome's `lint/suspicious/noExplicitAny` and `lint/correctness/noUnusedVariables` — keeping the same policy
- Remove commitlint-related lint config (already not a pre-commit hook, but `commitlint.config.js` will be left in place since it's unrelated to ESLint)
- Run Biome check across the codebase, fixing auto-fixable issues and manually reviewing remaining diagnostics
- Drop `prettier-eslint`, `prettier-eslint-cli`, `eslint-config-prettier`, `eslint-plugin-import`, `eslint-plugin-n`, `eslint-plugin-prettier`, `eslint-plugin-promise` from devDependencies
- Configure VSCode settings (`.vscode/settings.json`) to use Biome as the default formatter for JS/TS files

## Capabilities

### New Capabilities
- `linting-and-formatting`: Biome-powered linting and formatting for the backend package, replacing the ESLint + Prettier stack

### Modified Capabilities
<!-- No existing specs are changing — this is purely a tooling migration with no user-facing behavior changes. -->

## Impact

- `voluntarios-back/package.json`: devDependencies reduced by ~14 packages, scripts updated
- `voluntarios-back/eslint.config.mjs` removed
- `voluntarios-back/eslintrc.json` removed
- `voluntarios-back/biome.json` created
- `voluntarios-back/.vscode/settings.json` updated (or created)
- CI pipeline: `pnpm run lint` now runs Biome instead of ESLint
- Developer workflow: `pnpm run lint` and new `pnpm run format` commands
- Source code: auto-fixable lint issues resolved; manual fixes for remaining diagnostics
