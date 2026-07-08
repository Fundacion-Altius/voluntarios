## Why

The backend currently uses deep relative imports (`../../`, `../`) throughout the codebase, making it difficult to refactor directory structures and reducing readability. TypeScript path aliases (e.g., `@/` → `src/`) provide a clean, absolute-like import style that is more maintainable and standard across Node.js/TypeScript projects.

## What Changes

- **BREAKING**: All existing relative imports in `src/` are migrated to use `@/` path aliases
- Add `baseUrl` and `paths` configuration to `tsconfig.json`
- Configure `tsconfig-paths` or equivalent runtime resolution for the compiled output

## Capabilities

### New Capabilities
- `import-aliases`: TypeScript path alias configuration and migration of all source imports from relative paths to `@/` aliased paths

### Modified Capabilities
- *None* — no existing spec files at `openspec/specs/` have requirement changes

## Impact

- **Backend** (`voluntarios-back`): New `tsconfig.json` paths config, all `import` statements across `src/` rewritten from relative `../../` to `@/` prefixed paths
- **Runtime**: May need `tsconfig-paths` or `module-alias` for compiled Node.js resolution if `ts-node` doesn't handle it natively
- **Tests**: vitest may need `resolve.alias` config to match the tsconfig paths
