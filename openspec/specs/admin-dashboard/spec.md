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

### Requirement: Admin Dashboard Access
The system SHALL provide an admin dashboard page accessible only to users with admin roles.

#### Scenario: Admin user accesses dashboard
- **WHEN** an authenticated user with admin role navigates to /dashboard
- **THEN** the system displays the admin dashboard page

#### Scenario: Non-admin user attempts to access dashboard
- **WHEN** an authenticated user without admin role attempts to navigate to /dashboard
- **THEN** the system redirects to an unauthorized page

### Requirement: Dashboard Overview
The system SHALL display key metrics and navigation options on the admin dashboard.

#### Scenario: Dashboard displays metrics
- **WHEN** admin user views the dashboard
- **THEN** the system shows total users, contracts, surveys, and recent activity

#### Scenario: Dashboard navigation
- **WHEN** admin user clicks on navigation links
- **THEN** the system navigates to the corresponding admin section
