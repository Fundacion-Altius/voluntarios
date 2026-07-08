## ADDED Requirements

### Requirement: TypeScript path alias for `@/`

The system SHALL configure a TypeScript path alias `@/` mapping to the `src/` directory in `tsconfig.json`.

#### Scenario: tsconfig.json has @/ alias
- **WHEN** the project is compiled
- **THEN** TypeScript SHALL resolve `@/components/foo` to `src/components/foo`

### Requirement: Runtime alias resolution

The system SHALL register the `@/` alias at runtime so that both the dev server (`ts-node`) and production build (`node ./build/index.js`) resolve `@/` correctly.

#### Scenario: ts-node resolves @/ in development
- **WHEN** `npm run dev` runs and a module imports with `@/`
- **THEN** `ts-node` SHALL resolve `@/` to the correct `src/` path

### Requirement: All deep relative imports use `@/`

The system SHALL migrate every import in `src/` that traverses 2+ directory levels (`../../`) to use the `@/` alias instead.

#### Scenario: Controller imports use @/
- **WHEN** a controller file imports from an infra or db module
- **THEN** it SHALL use `@/` instead of a relative path

#### Scenario: Repository imports use @/
- **WHEN** an infra file imports from entities, db, or types
- **THEN** it SHALL use `@/` instead of a relative path

### Requirement: vitest resolves the same aliases

The system SHALL configure vitest's `resolve.alias` in `vitest.config.ts` to match the tsconfig `paths`.

#### Scenario: vitest tests resolve @/ imports
- **WHEN** vitest runs a test file that imports using `@/`
- **THEN** vitest SHALL resolve the alias correctly
