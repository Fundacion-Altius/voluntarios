## Purpose

Users have a role property that determines their permissions and data access within the application.

## Requirements

### Requirement: Users have a role property

The system SHALL store each user with a `role` field of type `'admin' | 'nave' | 'general'`.

#### Scenario: User record is created on first login

- **WHEN** a user logs in for the first time via Microsoft Entra ID
- **THEN** the system SHALL create a new user record with their email and name from the Microsoft profile
- **THEN** the system SHALL assign a default role of `general`

#### Scenario: Existing user is retrieved on subsequent logins

- **WHEN** a returning user logs in
- **THEN** the system SHALL find their existing user record
- **THEN** the system SHALL NOT change their existing role

### Requirement: User role can be managed via API

The system SHALL provide an API endpoint for admins to update user roles.

#### Scenario: Admin updates a user role

- **WHEN** an admin user sends a PUT /api/users/:id/role with body `{ "role": "nave" }`
- **THEN** the backend SHALL update the user's role in the database
- **THEN** the backend SHALL respond with the updated user record

#### Scenario: Non-admin cannot update roles

- **WHEN** a non-admin user attempts to call PUT /api/users/:id/role
- **THEN** the backend SHALL respond with HTTP 403 Forbidden

### Requirement: Users are stored across all three backends

The system SHALL persist users across all three backends (in-memory for dev, MariaDB for staging, Supabase for production), following the same repository pattern as contracts.

#### Scenario: User repository selected by NODE_ENV

- **WHEN** the application starts
- **THEN** the user repository SHALL be selected based on `NODE_ENV`: in-memory for `development`, MariaDB for `staging`, Supabase for `production`
