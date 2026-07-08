## Purpose

TypeScript path alias `@/` maps to `src/`, simplifying imports and avoiding deep relative paths.

## Requirements

### Requirement: TypeScript path alias for `@/`

The system SHALL configure a TypeScript path alias `@/` mapping to the `src/` directory in `tsconfig.json`.

#### Scenario: tsconfig.json has @/ alias
- **WHEN** the project is compiled
- **THEN** TypeScript SHALL resolve `@/components/foo` to `src/components/foo`

### Requirement: Runtime alias resolution

The system SHALL register the `@/` alias at runtime so both dev and production resolve correctly.

#### Scenario: ts-node resolves @/ in development
- **WHEN** `npm run dev` runs and a module imports with `@/`
- **THEN** `ts-node` SHALL resolve `@/` to the correct `src/` path

### Requirement: All deep relative imports use `@/`

The system SHALL migrate every import in `src/` that traverses 2+ directory levels to use the `@/` alias instead.

### Requirement: vitest resolves the same aliases

The system SHALL configure vitest's `resolve.alias` to match the tsconfig `paths`.
