## 1. Backend: Auth & User Infrastructure

- [x] 1.1 Add dependencies: `jsonwebtoken`, `jwks-rsa`, `express-async-errors`
- [x] 1.2 Add Supabase migration for `users` table (id, email, name, role, created_at)
- [x] 1.3 Add MariaDB migration for `users` table (id VARCHAR 36, email VARCHAR 255 unique, name VARCHAR 255, role VARCHAR 20 default 'general', created_at TIMESTAMP)
- [x] 1.4 Update `src/entities/User.ts` — add `role` field (`'admin' | 'nave' | 'general'`), export `Role` type, update existing `User` interface
- [x] 1.5 Create `IUserRepository` interface extending `IRepository<User>` with `findByEmail(email: string)`, `upsert(user: User)` methods (or add to existing `IRepository`)
- [x] 1.6 Update in-memory user repository (`inMemoryUserRepository.ts`) with `findByEmail`, `upsert`, `updateRole` methods and role field support
- [x] 1.7 Create MariaDB user repository (`mariaDBUserRepository.ts`) with full CRUD + `findByEmail`, `upsert`, `updateRole`
- [x] 1.8 Create Supabase user repository (`supabaseUserRepository.ts`) with `findByEmail`, `upsert`, `updateRole`
- [x] 1.9 Wire user repository selection by `NODE_ENV` in the user controller (matching contract repo pattern)

## 2. Backend: Microsoft Entra ID Token Validation

- [x] 2.1 Create `src/middleware/authMiddleware.ts` — validates Bearer token against Microsoft JWKS
- [x] 2.2 Create `src/middleware/roleMiddleware.ts` — checks `req.user.role` against required role
- [x] 2.3 Add environment variables for Azure AD tenant, client ID, issuer URL
- [x] 2.4 Export auth middleware + role middleware as composable route guards

## 3. Backend: Contract Filtering by Role

- [x] 3.1 Add `getAllFilteredByRole(role: Role)` method to the contract repository interface
- [x] 3.2 Implement in Supabase repository: Nave → `.contains("areas", "Nave")`, General → `.not.contains("areas", "Nave")`, Admin → no filter
- [x] 3.3 Implement in MariaDB contract repository filtering (SQL JSON_CONTAINS)
- [x] 3.4 Implement in inMemory contract repository filtering
- [x] 3.5 Update `getAllContracts` controller to use `req.user` for filtered queries
- [x] 3.6 Update `getContractById` to return 403 if user's role restricts access

## 4. Backend: User Role Management API

- [x] 4.1 Create `PUT /api/users/:id/role` route and controller (admin-only)
- [x] 4.2 Create `GET /api/users/me` route to return current user profile
- [x] 4.3 Protect user management routes with auth + admin role middleware

## 5. Frontend: Auth Setup

- [x] 5.1 Install `next-auth`
- [x] 5.2 Configure NextAuth with Azure AD provider (`src/app/api/auth/[...nextauth]/route.ts`)
- [x] 5.3 Create `src/app/auth/AuthProvider.tsx` wrapping children with SessionProvider
- [x] 5.4 Create `src/app/auth/useAuth.ts` hook exposing user, login, logout, token via next-auth

## 6. Frontend: Login Page

- [x] 6.1 Create `src/app/login/page.tsx` with "Sign in with Microsoft" button (using next-auth signIn)
- [x] 6.2 Handle redirect after successful login to `/dashboard`
- [x] 6.3 Handle auth errors (domain mismatch, token failure)

## 7. Frontend: Admin Dashboard

- [x] 7.1 Create `src/app/dashboard/layout.tsx` — checks auth, redirects to `/login` if unauthenticated
- [x] 7.2 Create `src/app/dashboard/page.tsx` — fetches contracts with Bearer token
- [x] 7.3 Create `src/app/components/ContractTable.tsx` — displays contracts in a table with role-based view
- [x] 7.4 Create `src/app/components/RoleBadge.tsx` — shows user role and contract count
- [x] 7.5 Add navigation header with user info and logout button

## 8. Testing

- [x] 8.1 Write backend unit tests for auth middleware (valid/invalid/missing token)
- [x] 8.2 Write backend unit tests for role middleware (each role access)
- [x] 8.3 Write backend unit tests for user repository (in-memory, MariaDB, Supabase)
- [x] 8.4 Write backend unit tests for contract filtering by role (all backends)
- [x] 8.5 Write frontend tests for login page rendering
- [x] 8.6 Write frontend tests for dashboard contract table filtering
- [x] 8.7 Write E2E test for login flow and dashboard access
