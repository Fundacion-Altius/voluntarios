## ADDED Requirements

### Requirement: Biome-based linting
The project SHALL use `@biomejs/biome` as the sole linting tool, replacing ESLint and all its plugins.

#### Scenario: Lint script runs Biome
- **WHEN** developer runs `pnpm run lint`
- **THEN** `biome check --write .` is executed

### Requirement: Biome-based formatting
The project SHALL use Biome's formatter as the sole code formatter, replacing Prettier.

#### Scenario: Format script formats code
- **WHEN** developer runs `pnpm run format`
- **THEN** `biome format --write .` is executed

#### Scenario: Biome lint includes formatting
- **WHEN** developer runs `pnpm run lint`
- **THEN** both linting and formatting checks are performed (via `biome check`)

### Requirement: Disabled rules preserved
The migration SHALL preserve the same relaxed policy for `no-explicit-any` and `no-unused-vars` by disabling the equivalent Biome rules.

#### Scenario: Explicit any allowed
- **WHEN** source code uses `any` type annotation
- **THEN** Biome does NOT report a diagnostic for `noExplicitAny`

#### Scenario: Unused variables allowed
- **WHEN** source code declares a variable that is never used
- **THEN** Biome does NOT report a diagnostic for `noUnusedVariables`

### Requirement: Ignore patterns preserved
The migration SHALL preserve the same file/directory ignore patterns as the current ESLint configuration.

#### Scenario: Build output ignored
- **WHEN** Biome checks files in `build/` directory
- **THEN** it does NOT analyze those files

#### Scenario: Test files ignored
- **WHEN** Biome checks files matching `*.spec.ts` or `*.test.ts`
- **THEN** it does NOT analyze those files

#### Scenario: Config files ignored
- **WHEN** Biome checks `drizzle.config.ts`, `vite.config.ts`, `vitest.config.ts`, `vitest.integration.config.ts`
- **THEN** it does NOT analyze those files

### Requirement: ESLint and Prettier dependencies removed
All ESLint-related and Prettier-related devDependencies SHALL be removed from `package.json`.

#### Scenario: ESLint packages absent
- **WHEN** checking `devDependencies` in `package.json` after migration
- **THEN** `eslint`, `@eslint/js`, `typescript-eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-import`, `eslint-plugin-n`, `eslint-plugin-prettier`, `eslint-plugin-promise`, `eslint-config-prettier`, `prettier`, `prettier-eslint`, and `prettier-eslint-cli` are absent

#### Scenario: Config files removed
- **WHEN** listing the project root after migration
- **THEN** `eslint.config.mjs` and `eslintrc.json` no longer exist

### Requirement: Biome config file created
The project SHALL have a `biome.json` configuration file that replaces both ESLint and Prettier configuration.

#### Scenario: Biome config exists
- **WHEN** checking the project root
- **THEN** `biome.json` exists

#### Scenario: Biome config has correct structure
- **WHEN** reading `biome.json`
- **THEN** it contains `$schema`, `organizeImports`, `linter`, `formatter`, and `files` sections with appropriate settings

### Requirement: VSCode configured for Biome
Visual Studio Code settings SHALL be updated to use Biome as the default formatter for JavaScript and TypeScript files.

#### Scenario: Biome as default formatter
- **WHEN** checking `.vscode/settings.json`
- **THEN** `"[javascript]"`, `"[typescript]"`, and related file types have `editor.defaultFormatter` set to `"biomejs.biome"`
