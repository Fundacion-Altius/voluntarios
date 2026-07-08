## Context

The platform currently has no authentication. Contracts are submitted publicly via a multi-step wizard. Staff from Fundación Altius need a way to log in and view contracts relevant to their role. Users have @fundacionaltius.org email addresses managed by Microsoft 365 (Outlook).

The backend is Express.js with three data backends selected by `NODE_ENV`: in-memory (development), MariaDB (staging), Supabase (production). The frontend is Next.js 14 (App Router) with React 18.

No ORM is used — the project queries Supabase and MariaDB directly with raw queries. Drizzle is not a dependency and is not being introduced. The existing repository pattern (`IRepository<T>`) is maintained for consistency.

## Goals / Non-Goals

**Goals:**
- Authenticate staff with their existing @fundacionaltius.org Microsoft 365 credentials
- Enforce role-based contract visibility at the API level
- Provide a dashboard UI for authenticated users
- Store user records and roles across all three backends (in-memory, MariaDB, Supabase), matching the existing pattern

**Non-Goals:**
- Self-service role management (roles assigned by admins only)
- Contract creation or editing from the dashboard (read-only for now)
- Audit logging of user actions
- User registration flow (users are auto-provisioned on first login)

## Decisions

1. **Microsoft Entra ID (Azure AD) for auth** — Users already have @fundacionaltius.org Outlook accounts. Using Microsoft Entra ID avoids managing passwords and integrates with their existing identity provider. Alternatives considered: Supabase Auth (doesn't natively support Outlook-only domain restriction), custom JWT (requires password management).

2. **Frontend: next-auth** — `next-auth` handles the OAuth flow with Azure AD provider, token acquisition, and session management. The token is sent as a Bearer header to backend API calls. Alternatives considered: `@azure/msal-react` + `@azure/msal-browser` (more boilerplate, less Next.js-native), passport in backend with session cookies (more complex for SPA).

3. **Backend: JWKS token validation** — The backend validates Microsoft-issued tokens using `jsonwebtoken` + `jwks-rsa` by fetching the Microsoft public keys. No need for a full Passport setup. A simple Express middleware reads the `Authorization` header, validates the token, and attaches the user to `req`. Alternatives considered: `passport-azure-ad` (heavy dependency, opinionated).

4. **Role filtering at the repository level** — Contract filtering by role is implemented in the Supabase repository layer by adding a `filterByRole(role)` method that appends a `.neq("areas", "cs.Nave")` or `.eq("areas", "cs.Nave")` query. This keeps the controller layer thin. Alternatives considered: filtering in the controller (mixes business logic with HTTP concerns), database views (less flexible).

5. **Users table across all three backends** — User data (id, email, name, role, created_at) is stored in all three backends following the existing repository pattern: in-memory for dev, MariaDB `users` table for staging, Supabase `users` table for production. The role defaults to `general` on first login. The repository is selected based on `NODE_ENV` just like contracts.

6. **Middleware-based route protection** — An Express middleware checks the validated token and required role (passed as a parameter). Routes declare their required role via `requireRole('admin')`. This is explicit and composable. Alternatives considered: route-level role checks in controllers (repetitive), aspect-oriented (non-standard in Express).

## Risks / Trade-offs

- **Token expiry UX** — MSAL handles silent refresh, but if the refresh fails the user is redirected to login. Mitigation: clear error messaging on the dashboard.
- **First-login role assignment** — Defaulting to `general` means a new user could see non-Nave contracts immediately. Mitigation: admin assigns the correct role proactively before the user's first login, or after.
- **Supabase RLS** — Not using Row-Level Security since filtering logic is domain-specific (areas array contains "Nave"). RLS with JSON array operations is brittle. Application-level filtering is more maintainable.
- **Domain lock-in** — Restricting to @fundacionaltius.org creates tight coupling. Acceptable since this is an internal tool for this organization.
