## ADDED Requirements

### Requirement: Admin can manage surveys
The system SHALL expose CRUD endpoints for surveys (encuestas) requiring authentication with admin role.

#### Scenario: Admin creates a survey
- **WHEN** an authenticated admin sends POST /api/surveys with `{ nombre, departamento, minutos }`
- **THEN** the system returns 201 with the created survey

#### Scenario: Admin lists surveys
- **WHEN** an authenticated user sends GET /api/surveys
- **THEN** the system returns 200 with an array of all surveys

#### Scenario: Admin gets survey by ID
- **WHEN** an authenticated user sends GET /api/surveys/:id
- **THEN** the system returns 200 with the survey if found, or 404 if not found

#### Scenario: Admin updates a survey
- **WHEN** an authenticated admin sends PUT /api/surveys/:id with updated fields
- **THEN** the system returns 200 with the updated survey

#### Scenario: Admin deletes a survey
- **WHEN** an authenticated admin sends DELETE /api/surveys/:id
- **THEN** the system returns 204

### Requirement: Questions are scoped to a survey
The system SHALL expose CRUD endpoints for questions (preguntas) scoped to a survey.

#### Scenario: Admin creates a question
- **WHEN** an authenticated admin sends POST /api/questions with `{ text, surveyID }`
- **THEN** the system returns 201 with the created question

#### Scenario: Anyone lists questions for a survey
- **WHEN** any request (authenticated or not) sends GET /api/questions
- **THEN** the system returns 200 with an array of questions

#### Scenario: Admin updates a question
- **WHEN** an authenticated admin sends PUT /api/questions/:id with updated fields
- **THEN** the system returns 200 with the updated question

#### Scenario: Admin deletes a question
- **WHEN** an authenticated admin sends DELETE /api/questions/:id
- **THEN** the system returns 204

### Requirement: Survey answers and submissions are tracked
The system SHALL expose CRUD endpoints for survey answers and survey submissions, restricted to admin role.

#### Scenario: Admin lists survey answers
- **WHEN** an authenticated admin sends GET /api/survey-answers
- **THEN** the system returns 200 with an array of all survey answers

#### Scenario: Admin lists survey submissions
- **WHEN** an authenticated admin sends GET /api/survey-submissions
- **THEN** the system returns 200 with an array of all survey submissions

### Requirement: Repositories work across all environments
The system SHALL provide repository implementations for surveys in all three backends: in-memory (development), MariaDB (staging), and Supabase (production).

#### Scenario: In-memory survey repo works in development
- **WHEN** NODE_ENV is "development" and a survey endpoint is called
- **THEN** the system uses in-memory storage and does not crash

#### Scenario: MariaDB survey repo works in staging
- **WHEN** NODE_ENV is "staging" and a survey endpoint is called
- **THEN** the system queries the MariaDB database

#### Scenario: Supabase survey repo works in production
- **WHEN** NODE_ENV is "production" and a survey endpoint is called
- **THEN** the system queries the Supabase database
