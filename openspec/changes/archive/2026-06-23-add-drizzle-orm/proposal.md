## Why

The backend currently uses raw SQL queries against both MariaDB and Supabase, with manually written TypeScript interfaces for each entity. This leads to duplicated type definitions, no compile-time query validation, and error-prone manual SQL. Drizzle ORM provides type-safe queries, a single source of truth for schemas, and migration tooling — reducing bugs and making the data layer maintainable.

## What Changes

- **BREAKING**: All existing repository implementations (Supabase + MariaDB + in-memory) are replaced with Drizzle-based implementations
- **BREAKING**: TypeScript entity interfaces are replaced with Drizzle-generated types from schema definitions
- Add `drizzle-orm` and `drizzle-kit` as dependencies
- Define Drizzle schemas for all tables: `contratos`, `encuestas`, `preguntas`, `survey_answers`, `survey_submissions`, `users`
- Generate TypeScript types from schemas via `drizzle-kit`
- Migrate `supabaseRepository.ts` (all 5 entity repos) to Drizzle
- Migrate `mariaDBRepository.ts` to Drizzle (contracts)
- Migrate `inMemory*Repository.ts` — keep as-is since Drizzle is DB-only; in-memory repos remain for tests
- Remove the hand-written `IRepository<T>` interface — replaced by Drizzle-generated query builders

## Capabilities

### New Capabilities
- `db-schema`: Drizzle schema definitions for all database tables, drizzle-kit config for migrations, and generated TypeScript types
- `drizzle-repositories`: Repository implementations using Drizzle ORM for both MariaDB and Supabase, replacing raw SQL queries

### Modified Capabilities
- *None* — no existing spec files at `openspec/specs/` have requirement changes (only the existing e2e-testing spec is present and is unrelated)

## Impact

- **Backend** (`voluntarios-back`): New `drizzle-orm` + `drizzle-kit` dev dependency, new `src/db/schema/` directory with table definitions, removal of hand-written entity interfaces, complete rewrite of Supabase and MariaDB repository files, new Drizzle client initialization per DB backend
- **Configuration**: New `drizzle.config.ts` at project root for kit configuration
- **Entities**: `src/entities/*.ts` files are replaced — their types come from `drizzle-orm` generated types. The `User.ts` entity may migrate to a Drizzle schema too (from the add-auth-and-rbac change)
- **Repository interface**: `IRepository<T>` may be simplified or replaced with direct Drizzle query calls
