## ADDED Requirements

### Requirement: Admin can configure onboarding tasks

The system SHALL allow admins to manage the set of onboarding tasks that new volunteers see.

#### Scenario: Create onboarding task
- **WHEN** an admin sends `POST /api/onboarding/tasks` with a title, description, and optional order
- **THEN** the system SHALL create a new task in the `onboarding_tasks` table

#### Scenario: List onboarding tasks (admin)
- **WHEN** an admin sends `GET /api/onboarding/tasks`
- **THEN** the system SHALL return all tasks ordered by their display order

#### Scenario: Update and delete tasks
- **WHEN** an admin sends `PUT /api/onboarding/tasks/:id` or `DELETE /api/onboarding/tasks/:id`
- **THEN** the system SHALL update or remove the task accordingly

#### Scenario: Seed initial tasks via migration
- **WHEN** the database migration runs
- **THEN** four default tasks SHALL be created:
  - "Completa tu perfil" (complete profile)
  - "Lee la guía del voluntario" (read volunteer guide)
  - "Reserva tu primera actividad" (book first activity)
  - "Descarga tu certificado" (download certificate)

### Requirement: Volunteers see their onboarding checklist

The system SHALL display an onboarding checklist on the volunteer portal home page.

#### Scenario: Get my onboarding progress
- **WHEN** an authenticated volunteer sends `GET /api/onboarding/my-progress`
- **THEN** the system SHALL return all tasks with a `completed` boolean per task for that volunteer
- **THEN** the response SHALL include the total count and completed count

#### Scenario: Mark task complete
- **WHEN** a volunteer sends `POST /api/onboarding/my-progress/complete` with `task_id`
- **THEN** the system SHALL create a progress record for that task+user with a `completed_at` timestamp

#### Scenario: Portal home shows onboarding card
- **WHEN** a volunteer visits `/portal`
- **THEN** a progress card SHALL show X of Y tasks completed with a progress bar
- **THEN** each uncompleted task SHALL have a check button
- **THEN** the card SHALL NOT reappear once all tasks are complete (or the user dismisses it)
