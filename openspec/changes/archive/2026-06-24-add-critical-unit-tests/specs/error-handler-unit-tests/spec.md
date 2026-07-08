## ADDED Requirements

### Requirement: Error handler returns correct status based on error type
The Express error middleware SHALL map specific error types to appropriate HTTP status codes.

#### Scenario: Returns 503 for DatabaseConnectionError
- **WHEN** `errorHandler` is called with an error having `name === 'DatabaseConnectionError'`
- **THEN** it SHALL set response status to 503 and send the error message

#### Scenario: Returns 500 for generic errors
- **WHEN** `errorHandler` is called with a generic `Error` object
- **THEN** it SHALL set response status to 500 and send the error message

#### Scenario: Returns 500 for unknown error types
- **WHEN** `errorHandler` is called with an error having a non-standard name
- **THEN** it SHALL set response status to 500 and send `err.message`
