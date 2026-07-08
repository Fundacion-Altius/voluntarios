## ADDED Requirements

### Requirement: Role Definition
The system SHALL define three user roles: admin, general, and nave.

#### Scenario: Role Definitions Exist
- **WHEN** system initializes
- **THEN** admin role exists with full permissions
- **AND** general role exists with standard permissions
- **AND** nave role exists with limited permissions

### Requirement: Role Assignment
The system SHALL allow assignment of roles to users.

#### Scenario: Assign Role to User
- **WHEN** administrator assigns a role to a user
- **THEN** user has the permissions associated with that role
- **AND** role assignment is persisted in database

#### Scenario: Multiple Roles per User
- **WHEN** user is assigned multiple roles
- **THEN** user has combined permissions from all roles

### Requirement: Role-Based Access Control
The system SHALL implement role-based access control.

#### Scenario: Admin Access
- **WHEN** user with admin role accesses admin-only feature
- **THEN** access is granted

#### Scenario: Non-Admin Access Denied
- **WHEN** user without admin role accesses admin-only feature
- **THEN** access is denied
- **AND** appropriate error message is displayed