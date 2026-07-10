## MODIFIED Requirements

### Requirement: Role Definition

The system SHALL define three user roles: admin, general, and nave. Users SHALL also have a `status` field that determines their access level.

#### Scenario: Role Definitions Exist
- **WHEN** system initializes
- **THEN** admin role exists with full permissions
- **AND** general role exists with standard permissions
- **AND** nave role exists with limited permissions

### Requirement: Users have a role and status property

The system SHALL store each user with a `role` field of type `'admin' | 'nave' | 'general'` and a `status` field of type `'candidate' | 'active' | 'inactive' | 'on-reserve'`. The `password_hash` field SHALL be nullable to support candidates who have not yet set credentials.

#### Scenario: Staff user record is created on first Microsoft login
- **WHEN** a staff user logs in for the first time via Microsoft Entra ID
- **THEN** the system SHALL create a new user record with their email and name from the Microsoft profile
- **THEN** the system SHALL assign a default role of `general`
- **THEN** the system SHALL assign a default status of `active`

#### Scenario: Volunteer user record is created on application
- **WHEN** a person submits the volunteer application form
- **THEN** the system SHALL create a new user record with their data
- **THEN** the system SHALL assign role `general`
- **THEN** the system SHALL assign status `candidate`
- **THEN** the system SHALL set `password_hash` to null

#### Scenario: Existing user is retrieved on subsequent logins
- **WHEN** a returning user logs in
- **THEN** the system SHALL find their existing user record
- **THEN** the system SHALL NOT change their existing role or status

## ADDED Requirements

### Requirement: Status changes are audited

The system SHALL maintain a `user_status_log` table recording every status change with user_id, old_status, new_status, changed_by, reason, and timestamps.

#### Scenario: Status audit is written
- **WHEN** any user's status field changes (by admin action or system)
- **THEN** the system SHALL insert a row in `user_status_log` with complete metadata

### Requirement: User type distinguishes registration method

The system SHALL store each user with a `user_type` field: `'staff'` (created via Microsoft login) or `'volunteer'` (created via application form or Excel import). Defaults to `'staff'` for backward compatibility.

#### Scenario: Staff type on Microsoft login
- **WHEN** a user is created via Microsoft Entra ID login
- **THEN** the system SHALL set `user_type` to `'staff'`

#### Scenario: Volunteer type on application
- **WHEN** a user is created via the public form or Excel import
- **THEN** the system SHALL set `user_type` to `'volunteer'`
