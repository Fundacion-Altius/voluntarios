## ADDED Requirements

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