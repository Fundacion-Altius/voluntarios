# Admin Surveys Page

## Purpose

Provide a survey management page at `/encuestas` for admins to list, create surveys, and view aggregated results.

## Requirements

### Requirement: Surveys page lists all surveys
The system SHALL display a list of all surveys at `/encuestas`.

#### Scenario: Surveys page renders a survey list
- **WHEN** an admin navigates to `/encuestas`
- **THEN** a list or table of surveys SHALL be displayed with title, creation date, and status

### Requirement: Admin can create a new survey
The system SHALL allow admins to create new surveys from the `/encuestas` page.

#### Scenario: Create survey button opens a form
- **WHEN** an admin clicks a "Nueva Encuesta" button
- **THEN** a form SHALL appear with fields for survey title and question selection

#### Scenario: Create survey submits to backend
- **WHEN** an admin fills in the form and submits
- **THEN** a POST request SHALL be sent to `/api/surveys`
- **AND** on success, the new survey SHALL appear in the list

### Requirement: Admin can view survey results
The system SHALL allow admins to view aggregated survey results per survey.

#### Scenario: View results shows ratings
- **WHEN** an admin clicks "Ver Resultados" on a survey
- **THEN** the system SHALL display aggregated ratings for each question in the survey
- **AND** average ratings SHALL be shown

#### Scenario: Survey results are fetched from backend
- **WHEN** the view results page loads
- **THEN** a GET request SHALL be sent to `/api/surveys/get-report`
- **AND** the report data SHALL be rendered

### Requirement: Survey report endpoint works with Postgres
The system SHALL implement the `getReport()` method in the Postgres survey repository.

#### Scenario: PG getReport returns aggregated data
- **WHEN** an admin requests the survey report in staging/production mode
- **THEN** the PG survey repository SHALL query survey_answers and survey_submissions
- **AND** return aggregated ratings per question
