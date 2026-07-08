## Purpose

Authenticated users access a protected admin dashboard at /dashboard displaying contracts filtered by role.

## Requirements

### Requirement: Authenticated users can access an admin dashboard

The system SHALL provide a protected dashboard page at /dashboard that displays contracts filtered by the user's role.

#### Scenario: Authenticated user sees dashboard

- **WHEN** an authenticated user navigates to /dashboard
- **THEN** the system SHALL display a table of contracts filtered by their role
- **THEN** the table SHALL show columns: name, email, areas, date, and an actions column

#### Scenario: Unauthenticated user is redirected to login

- **WHEN** an unauthenticated user navigates to /dashboard
- **THEN** the system SHALL redirect them to the login page

#### Scenario: Dashboard shows contract count and role badge

- **WHEN** an authenticated user views the dashboard
- **THEN** the system SHALL display the user's role as a badge
- **THEN** the system SHALL display the total count of visible contracts
