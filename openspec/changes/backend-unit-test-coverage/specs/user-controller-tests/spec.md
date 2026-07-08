## Purpose

Unit tests for `userController.ts` (167 lines, 10 handlers) using the real in-memory user repository — no mocking.

## Requirements

### Requirement: getAllUsers returns filtered users based on role

#### Scenario: Returns 200 with all users for admin
- **GIVEN** the in-memory user repo has multiple users with different roles
- **WHEN** `getAllUsers` is called by an admin user
- **THEN** it SHALL return a 200 JSON with all users (no password hashes)

#### Scenario: Returns 200 with same-role users for non-admin
- **GIVEN** the in-memory user repo has users with different roles
- **WHEN** `getAllUsers` is called by a non-admin user (e.g., nave)
- **THEN** it SHALL return only users whose first role matches the caller's role

#### Scenario: Returns 500 on repository error
- **WHEN** `getAllUsers` is called and the repository throws
- **THEN** it SHALL return a 500 response

### Requirement: getUserById returns user by ID

#### Scenario: Returns 200 for existing user
- **GIVEN** a user exists with a known ID
- **WHEN** `getUserById` is called with that ID
- **THEN** it SHALL return a 200 JSON with user data (no password hash)

#### Scenario: Returns 404 for non-existent user
- **WHEN** `getUserById` is called with a non-existent ID
- **THEN** it SHALL return a 404 response

### Requirement: createUser creates a new user

#### Scenario: Returns 201 for valid input
- **WHEN** `createUser` is called with `{ name, email, role, password }`
- **THEN** it SHALL:
  - Hash the password with bcrypt
  - Create the user via repository
  - Return 201 with the created user (no password hash)

#### Scenario: Returns 201 with defaults when optional fields are omitted
- **WHEN** `createUser` is called with only `{ password }`
- **THEN** it SHALL use default values for `name`, `email`, and `role`

### Requirement: updateUser updates user by ID

#### Scenario: Returns 200 with success for existing user
- **GIVEN** a user exists with a known ID
- **WHEN** `updateUser` is called with valid body
- **THEN** it SHALL return 200 with `{ success: true, data: user }`

#### Scenario: Returns 200 with failure for non-existent user
- **WHEN** `updateUser` is called with a non-existent ID
- **THEN** it SHALL return 200 with `{ success: false, error: 'ID not found' }`

#### Scenario: Returns 500 on repository error
- **WHEN** `updateUser` is called and the repository throws
- **THEN** it SHALL return a 500 response

### Requirement: deleteUser deletes user by ID

#### Scenario: Returns 204 for successful deletion
- **GIVEN** a user exists with a known ID
- **WHEN** `deleteUser` is called with that ID
- **THEN** it SHALL delete the user and return 204

#### Scenario: Returns 200 with failure for non-existent user
- **WHEN** `deleteUser` is called with a non-existent ID
- **THEN** it SHALL return 200 with `{ success: false, error: '...' }`

#### Scenario: Returns 500 on repository error
- **WHEN** `deleteUser` is called and the repository throws
- **THEN** it SHALL return a 500 response

### Requirement: updateUserRole validates and updates user role

#### Scenario: Returns 200 with user for valid role update
- **GIVEN** a user exists with a known ID
- **WHEN** `updateUserRole` is called with `{ role: 'admin' }`
- **THEN** it SHALL update the role and return 200 with the user

#### Scenario: Returns 400 for invalid role
- **WHEN** `updateUserRole` is called with an invalid role value
- **THEN** it SHALL return 400 with error message

#### Scenario: Returns 404 for non-existent user
- **WHEN** `updateUserRole` is called with a non-existent ID
- **THEN** it SHALL return 404 with error message

### Requirement: getUserRoles returns roles for user

#### Scenario: Returns 200 with roles for existing user
- **GIVEN** a user exists with assigned roles
- **WHEN** `getUserRoles` is called with that user's ID
- **THEN** it SHALL return 200 with `{ roles: [...] }`

#### Scenario: Returns 404 for user without roles
- **GIVEN** a user exists but has no roles assigned
- **WHEN** `getUserRoles` is called with that user's ID
- **THEN** it SHALL return 404 with error message

### Requirement: addUserRole adds role to user

#### Scenario: Returns 200 for valid role
- **GIVEN** a user exists with a known ID
- **WHEN** `addUserRole` is called with `{ role: 'admin' }`
- **THEN** it SHALL add the role and return 200

#### Scenario: Returns 400 for invalid role
- **WHEN** `addUserRole` is called with an invalid role value
- **THEN** it SHALL return 400 with error message

### Requirement: removeUserRole removes role from user

#### Scenario: Returns 200 for valid role
- **GIVEN** a user exists with a known ID and has the specified role
- **WHEN** `removeUserRole` is called with `{ role: 'admin' }`
- **THEN** it SHALL remove the role and return 200

#### Scenario: Returns 400 for invalid role
- **WHEN** `removeUserRole` is called with an invalid role value
- **THEN** it SHALL return 400 with error message

#### Scenario: Returns 400 for user without roles
- **GIVEN** a user exists but has no roles
- **WHEN** `removeUserRole` is called
- **THEN** it SHALL return 400 with error message

### Requirement: getMe returns authenticated user

#### Scenario: Returns 200 with user data
- **GIVEN** `req.user` is set
- **WHEN** `getMe` is called
- **THEN** it SHALL return 200 with the user object from `req.user`

#### Scenario: Returns 401 when not authenticated
- **GIVEN** `req.user` is undefined/null
- **WHEN** `getMe` is called
- **THEN** it SHALL return 401 with error message
