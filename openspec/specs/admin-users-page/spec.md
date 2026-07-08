# Admin Users Page

## Purpose

Provide a user management page at `/usuarios` for admins to list, create, edit, and delete users.

## Requirements

### Requirement: Users page shows paginated users table
The system SHALL display a paginated users table at `/usuarios` with search functionality.

#### Scenario: Users page renders a data table
- **WHEN** an admin navigates to `/usuarios`
- **THEN** a DataTable SHALL be rendered with columns: Name, Email, Role, Created At, Last Login, Actions (edit/delete)

#### Scenario: Users table can be searched
- **WHEN** an admin types in the search input
- **THEN** the table SHALL filter users by name or email

### Requirement: Admin can create a new user
The system SHALL allow admins to create new users from the `/usuarios` page.

#### Scenario: Create user button opens a form
- **WHEN** an admin clicks a "Nuevo Usuario" button
- **THEN** a modal or drawer SHALL open with fields for name, email, and role selection

#### Scenario: Create user submits to backend
- **WHEN** an admin fills in the create user form and submits
- **THEN** a POST request SHALL be sent to `/api/users`
- **AND** on success, the user SHALL be added to the table
- **AND** on failure, an error message SHALL be displayed

### Requirement: Admin can edit a user's role
The system SHALL allow admins to change a user's role from the `/usuarios` page.

#### Scenario: Edit user opens a form with current values
- **WHEN** an admin clicks edit on a user row
- **THEN** a modal SHALL open with the user's current name, email, and role pre-filled

#### Scenario: Edit user submits to backend
- **WHEN** an admin modifies user data and submits
- **THEN** a PUT request SHALL be sent to `/api/users/:id`
- **AND** on success, the table SHALL update

### Requirement: Admin can delete a user
The system SHALL allow admins to remove users from the `/usuarios` page.

#### Scenario: Delete user requires confirmation
- **WHEN** an admin clicks delete on a user row
- **THEN** a confirmation dialog SHALL appear

#### Scenario: Delete user submits to backend
- **WHEN** an admin confirms deletion
- **THEN** a DELETE request SHALL be sent to `/api/users/:id`
- **AND** the user SHALL be removed from the table
