## Context

The backend currently uses deep relative imports (`../../`, `../`) across `src/`. There are 26 relative import statements in source files (11 double-dot, 15 single-dot), concentrated in `src/api/controllers/`, `src/api/routes/`, `src/infra/inMemory/`, and the two root-level files `src/utils.ts` and `src/PDFGeneration.ts`.

No TypeScript path aliases are configured in `tsconfig.json` — `baseUrl` and `paths` are commented out.

The project runs via `ts-node` for dev (with `nodemon` watch) and compiles to `./build/` for production via `tsc`.

## Goals / Non-Goals

**Goals:**
- Configure `@/` path alias mapping to `src/` in `tsconfig.json`
- Migrate all deep relative imports (`../../`) across `src/` to `@/` prefixed aliases
- Ensure both dev (`ts-node`) and production (`node ./build/`) resolve aliases correctly
- Configure vitest's `resolve.alias` to match for test compatibility

**Non-Goals:**
- Migrating shallow same-directory imports (`./file`) — acceptable as-is
- Adding aliases for other directories (e.g., `@db/`, `@api/`) — `@/` alone is sufficient
- Changing the frontend (only `voluntarios-back` is in scope)
- Renaming, moving, or restructuring directories

## Decisions

1. **`@/` prefix mapping to `src/`** — Single alias rather than per-directory aliases. Simpler to configure, fewer imports to change, and prevents import confusion between `@/types` vs `@db/types` etc.

2. **`tsconfig-paths` for runtime** — `ts-node` does NOT resolve `paths` by default. The `tsconfig-paths` package registers the aliases at runtime for both `ts-node` (dev) and the compiled output (production). This is the standard approach used in most TypeScript Node.js projects.

3. **vitest `resolve.alias`** — vitest does not read tsconfig `paths` automatically. We configure it in `vitest.config.ts` to match the tsconfig alias.

4. **No `module-alias` or `babel-plugin-module-resolver`** — `tsconfig-paths` is the simplest solution for a ts-node + tsc project. Alternatives add unnecessary complexity.

## Risks / Trade-offs

- **Runtime resolution** — `tsconfig-paths` must be registered before any imports execute. Mitigation: import it at the entry point (`src/index.ts`) as the first import.
- **IDE support** — TypeScript path aliases are well-supported by VSCode and WebStorm out of the box once `tsconfig.json` paths are configured. No risk.
- **`tsconfig-paths` maintenance** — The package is stable but low-activity. If it becomes unmaintained, alternatives like `tsx` (which resolves paths natively) or `ts-node` with `tsconfig-paths` registered inline are drop-in replacements.
