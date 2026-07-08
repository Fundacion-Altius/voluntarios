## 1. Configuration

- [x] 1.1 Install `tsconfig-paths` npm package
- [x] 1.2 Configure `baseUrl` and `paths` in `tsconfig.json`: `"baseUrl": "./", "paths": { "@/*": ["src/*"] }`
- [x] 1.3 Register `tsconfig-paths` at the top of `src/index.ts`: `import "tsconfig-paths/register";`
- [x] 1.4 Configure vitest `resolve.alias` in `vitest.config.ts` to match: `resolve: { alias: { "@": path.resolve(__dirname, "src") } }`

## 2. Migrate Deep Relative Imports to `@/`

- [x] 2.1 `src/infra/inMemory/inMemoryContractRepository.ts` — rewrite `../../` imports to `@/`
- [x] 2.2 `src/infra/inMemory/inMemoryUserRepository.ts` — rewrite `../../` imports to `@/`
- [x] 2.3 `src/api/controllers/userController.ts` — rewrite `../../` imports to `@/`
- [x] 2.4 `src/api/routes/contractRoutes.ts` — rewrite `../` imports to `@/`
- [x] 2.5 `src/api/routes/userRoutes.ts` — rewrite `../` imports to `@/`
- [x] 2.6 `src/api/routes/pdfRoutes.ts` — rewrite `../` imports to `@/`

## 3. Verify

- [x] 3.1 Run `npm run typecheck` and fix any path resolution errors
- [x] 3.2 Run `npm run test` (vitest) and confirm all tests pass
- [x] 3.3 Start dev server (`npm run dev`) and smoke-test `/api/` endpoint
