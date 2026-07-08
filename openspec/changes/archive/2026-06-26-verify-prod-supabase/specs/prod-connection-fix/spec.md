## ADDED Requirements

### Requirement: Postgres.js connects to Supabase successfully
The system SHALL establish a working Postgres.js connection to Supabase when NODE_ENV=production.

#### Scenario: Connection succeeds with correct env vars
- **WHEN** NODE_ENV is production
- **WHEN** SUPABASE_DB_HOST is set or derivable from SUPABASE_URL
- **THEN** Postgres.js SHALL create a connection pool to Supabase
- **AND** the system SHALL log "Connected to Supabase/Postgres"

#### Scenario: Connection fails with clear error
- **WHEN** NODE_ENV is production
- **AND** SUPABASE_DB_HOST is unreachable or credentials are wrong
- **THEN** the system SHALL log a descriptive error message (e.g., "Supabase PostgreSQL connection refused: <details>")
- **AND** the system SHALL NOT crash the process (fail gracefully)

### Requirement: Derive DB host from SUPABASE_URL
If SUPABASE_DB_HOST is not explicitly set, the system SHALL derive it from SUPABASE_URL.

#### Scenario: DB host derived from URL
- **WHEN** SUPABASE_URL is https://blbjhfzsgyxanjtmnbdy.supabase.co
- **AND** SUPABASE_DB_HOST is not set
- **THEN** the derived host SHALL be db.blbjhfzsgyxanjtmnbdy.supabase.co

### Requirement: Connection pooling port
The system SHALL use Supabase's connection pooling port (6543) by default for production.

#### Scenario: Port 6543 used by default
- **WHEN** NODE_ENV is production
- **AND** SUPABASE_DB_PORT is not set
- **THEN** the connection port SHALL default to 6543
