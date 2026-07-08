## 1. Backend: Install dependencies

- [x] 1.1 Add `zod`, `@asteasolutions/zod-to-openapi`, `@scalar/api-reference`, `helmet` to `voluntarios-back/package.json` and run `pnpm install`
- [x] 1.2 Add `@types/helmet` dev dependency

## 2. Backend: Create Zod schemas

- [x] 2.1 Create `src/schemas/` directory and `src/schemas/index.ts` barrel
- [x] 2.2 Create `src/schemas/auth.schema.ts` with `loginSchema`, `refreshTokenSchema`
- [x] 2.3 Create `src/schemas/user.schema.ts` with `createUserSchema`, `updateUserSchema`, `updateRoleSchema`
- [x] 2.4 Create `src/schemas/contract.schema.ts` with `createContractSchema`, `updateContractSchema`, `contractQuerySchema` (pagination, sort, filters)
- [x] 2.5 Create `src/schemas/common.schema.ts` with reusable `paginationSchema`, `idParamSchema`

## 3. Backend: Create validation middleware

- [x] 3.1 Create `src/middleware/validate.ts` with `validate(schema, source)` factory function returning Express middleware
- [x] 3.2 Ensure error response shape is `{ errors: { field: string[] } }` compatible with existing error handler

## 4. Backend: Setup OpenAPI registry and generator

- [x] 4.1 Create `src/openapi/registry.ts` with shared `OpenAPIRegistry` instance and `extendZodWithOpenApi` call
- [x] 4.2 Create `src/openapi/generator.ts` with `generateOpenApiSpec()` function that produces the full OpenAPI 3.1 document
- [x] 4.3 Register auth routes (`POST /login`, `POST /logout`, `POST /refresh`, `GET /me`) in the registry with request/response schemas
- [x] 4.4 Register user routes (all CRUD + role management) in the registry
- [x] 4.5 Register contract routes (all CRUD) in the registry
- [x] 4.6 Register PDF and survey routes in the registry
- [x] 4.7 Configure `securitySchemes` for Bearer JWT and cookie auth

## 5. Backend: Serve OpenAPI spec and docs UI

- [x] 5.1 Add `GET /api/openapi.json` route that returns the generated spec
- [x] 5.2 Set up Scalar API reference at `/api-docs` using `@scalar/api-reference` Express middleware, pointing to `/api/openapi.json`
- [x] 5.3 Wire registration into server startup so schemas are registered before the spec is served

## 6. Backend: Replace manual validation with Zod middleware

- [x] 6.1 Replace `validateDatosContrato` usage in `contractController.createContract` with `validate(createContractSchema)` middleware on the route
- [x] 6.2 Add Zod validation to `userController.createUser` and `userController.updateUser` routes
- [x] 6.3 Add Zod validation to `authController.login` route
- [x] 6.4 Add Zod validation to contract query params (pagination, sort, filters)
- [x] 6.5 Remove or deprecate manual `validateDatosContrato` function in `src/utils.ts`

## 7. Backend: Add Helmet security headers

- [x] 7.1 Add `app.use(helmet())` in `src/index.ts` early in the middleware chain (after CORS, before routes)
- [x] 7.2 Verify Scalar docs render correctly under Helmet default CSP — no CSP exemption needed

## 8. Frontend: Install dependencies

- [x] 8.1 Add `@tanstack/react-query`, `@hey-api/openapi-ts`, `@hey-api/client-fetch` to `voluntarios-front/package.json` and run `pnpm install`
- [x] 8.2 Add `openapi-ts` config file `openapi-ts.config.ts` in frontend root

## 9. Frontend: Setup TanStack Query provider

- [x] 9.1 Create `src/app/QueryProvider.tsx` with `QueryClientProvider` and configured `QueryClient` (staleTime: 30s, retry: 1)
- [x] 9.2 Add `QueryProvider` to root layout wrapping existing providers

## 10. Frontend: Configure codegen

- [x] 10.1 Create `openapi-ts.config.ts` pointing to `http://localhost:3001/api/openapi.json`, output to `src/client/`
- [x] 10.2 Add `"predev": "openapi-ts"` script to `package.json`
- [x] 10.3 Add `src/client/` to `.gitignore`
- [x] 10.4 Add graceful fallback: check if backend is reachable before codegen, warn if not

## 11. Frontend: Generate and integrate typed client with auth

- [x] 11.1 Run codegen to produce `src/client/` with types, SDK, and TanStack Query hooks
- [x] 11.2 Create `src/lib/api.ts` that initializes the generated client with base URL from `NEXT_PUBLIC_API_URL`
- [x] 11.3 Add auth interceptor: read `getAuthToken()` and attach `Authorization: Bearer` header to every request
- [x] 11.4 Add CSRF interceptor: read `csrf_token` cookie and attach `X-CSRF-Token` header on mutations

## 12. Frontend: Refactor hooks with TanStack Query

- [x] 12.1 Create `src/hooks/` directory with barrel `index.ts`
- [x] 12.2 Refactor `useContracts` to use `useQuery` from the generated TanStack Query hooks, preserving pagination/sort/filter params
- [x] 12.3 Add `useCreateContract` mutation hook and `useDeleteContract` mutation hook
- [x] 12.4 Refactor `useAuth` to use `useMutation` for login/logout operations
- [x] 12.5 Extract `useContractForm` from `Contract.tsx` wizard state into `src/hooks/useContractForm.ts`
- [x] 12.6 Extract `usePagination` from `DataTable` into `src/hooks/usePagination.ts`
- [x] 12.7 Extract `useDebounce` from existing inline usage into `src/hooks/useDebounce.ts`
- [x] 12.8 Update all component imports to use new hook locations

## 13. Verification and cleanup

- [x] 13.1 Run `pnpm run typecheck` on backend — verify no type errors
- [x] 13.2 Run `pnpm run lint` on backend — verify no lint errors
- [x] 13.3 Run `pnpm test` on backend — verify all tests pass (98/100, 2 pre-existing timeouts)
- [x] 13.4 Run `pnpm run typecheck` on frontend — verify no type errors (only pre-existing e2e downlevelIteration errors)
- [x] 13.5 Run `pnpm test` on frontend — verify all tests pass (48/48)
- [x] 13.6 Run `pnpm run build` on frontend — verify build succeeds
- [x] 13.7 Start backend, navigate to `/api-docs` — verify Scalar UI loads and shows all endpoints
- [x] 13.8 Start both servers — verify frontend can fetch and display contracts
