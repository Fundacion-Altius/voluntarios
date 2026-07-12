## ADDED Requirements

### Requirement: Post-login redirect uses user_type

The login endpoint SHALL return `user_type` so the frontend can route volunteers to the portal and staff/admins to the admin dashboard.

#### Scenario: Volunteer logs in via credentials
- **WHEN** a user with `user_type === "volunteer"` successfully logs in via credentials
- **THEN** the backend SHALL include `user_type: "volunteer"` in the login response
- **THEN** the frontend SHALL redirect to `/portal`

#### Scenario: Staff/admin logs in via credentials
- **WHEN** a user with `user_type === "staff"` successfully logs in via credentials
- **THEN** the frontend SHALL redirect to `/admin/dashboard`

#### Scenario: Volunteer logs in via Azure AD
- **WHEN** a volunteer logs in via Azure AD (Microsoft SSO)
- **THEN** the frontend SHALL redirect to `/portal`

#### Scenario: JWT token includes user_type
- **WHEN** the backend signs a JWT for a logged-in user
- **THEN** the payload SHALL include `user_type` in addition to existing fields

#### Scenario: Auth middleware loads user_type for local tokens
- **WHEN** `authMiddleware` verifies a local (HS256) JWT
- **THEN** it SHALL fetch the full user from the database to get `user_type`
