## ADDED Requirements

### Requirement: Users Management Page
The system SHALL provide an admin users management page for viewing and managing user accounts.

#### Scenario: Admin accesses users page
- **WHEN** an authenticated admin user navigates to /usuarios
- **THEN** the system displays the users management page

#### Scenario: Non-admin attempts to access users page
- **WHEN** a non-admin user attempts to navigate to /usuarios
- **THEN** the system redirects to unauthorized page

### Requirement: User List Display
The system SHALL display a paginated list of all users with search and filtering capabilities.

#### Scenario: View user list
- **WHEN** admin user views the users page
- **THEN** the system shows a list of users with pagination controls

#### Scenario: Search users
- **WHEN** admin user searches for a specific user
- **THEN** the system updates the user list to show only matching users