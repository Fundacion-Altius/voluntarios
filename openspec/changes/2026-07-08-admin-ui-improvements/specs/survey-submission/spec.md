## MODIFIED Requirements

### Requirement: Anonymous survey submission

The system SHALL allow any user to submit a survey response with ratings.

#### Scenario: Submit endpoint is exempt from CSRF validation
- **WHEN** an anonymous POST request is sent to `/api/surveys/submit-answer` without an `x-csrf-token` header
- **THEN** the system SHALL accept the request (no 403 from CSRF middleware)

#### Scenario: Submit endpoint does not require authentication
- **WHEN** an unauthenticated request is sent to POST /api/surveys/submit-answer
- **THEN** the system accepts the request (no 401/403)

## E2E Test Scenarios

### Scenario: Survey form loads questions from real backend
- **GIVEN** the backend is running in development mode (in-memory repos with seed questions)
- **WHEN** a user navigates to `/encuesta`
- **THEN** the page fetches questions from GET /api/questions
- **THEN** the user sees the survey form with star ratings for each question

### Scenario: Anonymous user submits survey without CSRF token
- **GIVEN** the user is on `/encuesta`
- **WHEN** the user selects star ratings for all questions and clicks "Enviar"
- **THEN** the form sends a POST to `/api/surveys/submit-answer` without an `x-csrf-token` header
- **THEN** the backend accepts the request (200, no 403)
- **THEN** the user is redirected to `/encuesta/confirmacion`
