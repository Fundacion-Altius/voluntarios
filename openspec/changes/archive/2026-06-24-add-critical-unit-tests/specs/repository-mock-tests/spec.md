## ADDED Requirements

### Requirement: MariaDB user repository CRUD returns expected Result types
The `mariaDBUserRepository` SHALL return correctly typed `Result<User>` for all CRUD operations when the database layer is mocked.

#### Scenario: getAll returns success with user list
- **WHEN** `mariaDBUserRepository().getAll()` is called and the Drizzle query returns rows
- **THEN** it SHALL return `{ success: true, data: User[] }`

#### Scenario: getById returns success for existing user
- **WHEN** `mariaDBUserRepository().getById(id)` is called and the user exists
- **THEN** it SHALL return `{ success: true, data: User }`

#### Scenario: getById returns failure for non-existent user
- **WHEN** `mariaDBUserRepository().getById(id)` is called and no user is found
- **THEN** it SHALL return `{ success: false, error: string }`

#### Scenario: create inserts and returns the new user
- **WHEN** `mariaDBUserRepository().create(user)` is called
- **THEN** it SHALL insert the user via Drizzle and return `{ success: true, data: User }`

#### Scenario: update modifies existing user
- **WHEN** `mariaDBUserRepository().update(id, data)` is called for an existing user
- **THEN** it SHALL return `{ success: true, data: User }`

#### Scenario: delete removes existing user
- **WHEN** `mariaDBUserRepository().delete(id)` is called for an existing user
- **THEN** it SHALL return `{ success: true, data: { message: string } }`

#### Scenario: Handles database errors gracefully
- **WHEN** any MariaDB repository method throws during database access
- **THEN** it SHALL return `{ success: false, error: string }` with a DatabaseConnectionError

### Requirement: Supabase user repository CRUD returns expected Result types
The `supabaseUserRepository` SHALL return correctly typed `Result<User>` for all CRUD operations when the database layer is mocked.

#### Scenario: getAll returns success with user list
- **WHEN** `supabaseUserRepository().getAll()` is called and the Drizzle query returns rows
- **THEN** it SHALL return `{ success: true, data: User[] }`

#### Scenario: getById returns success for existing user
- **WHEN** `supabaseUserRepository().getById(id)` is called and the user exists
- **THEN** it SHALL return `{ success: true, data: User }`

#### Scenario: getById returns failure for non-existent user
- **WHEN** `supabaseUserRepository().getById(id)` is called and no user is found
- **THEN** it SHALL return `{ success: false, error: string }`

#### Scenario: Handles database errors gracefully
- **WHEN** any Supabase repository method throws during database access
- **THEN** it SHALL return `{ success: false, error: string }` with a SupabaseError
