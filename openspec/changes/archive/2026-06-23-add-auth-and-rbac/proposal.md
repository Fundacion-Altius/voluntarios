## Why

Currently the platform has no authentication or authorization. Volunteers fill out contracts publicly with no way for staff to view, filter, or manage them. Staff need a dashboard where they can log in with their @fundacionaltius.org Outlook emails and see contracts filtered by their role.

## What Changes

- Add Microsoft Entra ID (Azure AD) authentication for @fundacionaltius.org email users
- Introduce three roles: `admin`, `nave`, `general` (non-Nave volunteers coordinator)
- Add role-based contract filtering on the backend API
- Create a frontend admin dashboard to view contracts filtered by role
- Add a user management model with role assignment
- Protect the admin dashboard routes with authentication middleware
- Add a login page on the frontend

## Capabilities

### New Capabilities
- `user-auth`: Authentication with Microsoft Entra ID (Outlook / Office 365). Staff log in with their @fundacionaltius.org corporate email via OAuth 2.0 / OpenID Connect.
- `contract-visibility-rbac`: Role-based contract querying. `nave` role sees only contracts whose `areas` contain "Nave". `general` role sees all contracts except those with "Nave" area. `admin` role sees all contracts.
- `admin-dashboard`: Protected dashboard UI where authenticated users can browse, search, and view contracts according to their role permissions.
- `user-role-management`: Backend model and API for users (id, email, name, role). Role is assigned on first login or manually by an admin.

### Modified Capabilities
- *None* — no existing capabilities have spec-level requirement changes.

## Impact

- **Backend** (`voluntarios-back`): New auth middleware, user repository/model with roles, contract query filtering by role, Microsoft Entra ID token validation. New dependencies: `jsonwebtoken`, `jwks-rsa`, `msal` or `passport-azure-ad`.
- **Frontend** (`voluntarios-front`): New login page, auth via next-auth, protected layout for admin dashboard, contract list view with role-based filtering. New dependencies: `next-auth`.
- **Database** (Supabase): New `users` table with role column, or add role column to existing user storage.
- **Infrastructure**: Environment variables for Azure AD tenant ID, client ID, client secret.
