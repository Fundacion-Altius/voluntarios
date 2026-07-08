## Purpose

Admins can manage surveys (encuestas), questions (preguntas), survey answers, and survey submissions via CRUD endpoints.

## Requirements

### Requirement: Admin can manage surveys

The system SHALL expose CRUD endpoints for surveys requiring admin role.

#### Scenario: Admin creates a survey
- **WHEN** an authenticated admin sends POST /api/surveys with `{ nombre, departamento, minutos }`
- **THEN** the system returns 201 with the created survey

#### Scenario: Admin lists surveys
- **WHEN** an authenticated user sends GET /api/surveys
- **THEN** the system returns 200 with all surveys

#### Scenario: Admin updates a survey
- **WHEN** an authenticated admin sends PUT /api/surveys/:id
- **THEN** the system returns 200 with the updated survey

#### Scenario: Admin deletes a survey
- **WHEN** an authenticated admin sends DELETE /api/surveys/:id
- **THEN** the system returns 204

### Requirement: Questions are scoped to a survey

#### Scenario: Admin creates a question
- **WHEN** an authenticated admin sends POST /api/questions with `{ text, surveyID }`
- **THEN** the system returns 201

#### Scenario: Anyone lists questions
- **WHEN** any request sends GET /api/questions
- **THEN** the system returns 200 with all questions

### Requirement: Survey answers and submissions are tracked

#### Scenario: Admin lists answers
- **WHEN** an authenticated admin sends GET /api/survey-answers
- **THEN** the system returns 200 with all answers

#### Scenario: Admin lists submissions
- **WHEN** an authenticated admin sends GET /api/survey-submissions
- **THEN** the system returns 200 with all submissions

### Requirement: Repositories work across all environments

The system SHALL provide survey repository implementations for in-memory (dev), MariaDB (staging), and Supabase (production).
