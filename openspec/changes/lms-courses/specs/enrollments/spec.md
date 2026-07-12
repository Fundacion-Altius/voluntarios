## ADDED Requirements

### Requirement: Volunteers can enroll in courses

The system SHALL allow volunteers to self-enroll in published courses.

#### Scenario: Enroll in course
- **WHEN** an authenticated volunteer sends `POST /api/courses/:courseId/enroll`
- **THEN** the system SHALL create an enrollment with `status: "enrolled"` and `progress_pct: 0`

#### Scenario: Cannot enroll twice
- **WHEN** an authenticated volunteer sends `POST /api/courses/:courseId/enroll` for a course they are already enrolled in
- **THEN** the system SHALL return the existing enrollment

### Requirement: Volunteers can track progress

The system SHALL track lesson-by-lesson progress and calculate overall course completion percentage.

#### Scenario: Mark lesson complete
- **WHEN** an enrolled volunteer sends `POST /api/courses/:courseId/lessons/:lessonId/complete`
- **THEN** the system SHALL create a `lesson_progress` record with `completed_at` timestamp
- **THEN** the enrollment `progress_pct` SHALL be recalculated

#### Scenario: Progress percentage calculation
- **WHEN** a volunteer has completed 3 out of 10 lessons in a course
- **THEN** the enrollment `progress_pct` SHALL be `30`

#### Scenario: Course completion triggers points
- **WHEN** a volunteer completes the last remaining lesson of a course
- **THEN** the enrollment `status` SHALL change to `"completed"`
- **THEN** the enrollment `completed_at` SHALL be set
- **THEN** 100 points SHALL be awarded via the gamification system with source `"course_completion"`

#### Scenario: Get my enrollments
- **WHEN** an authenticated user sends `GET /api/courses/my-enrollments`
- **THEN** the system SHALL return all enrollments for that user with course details, progress_pct, and status

### Requirement: Admin can see enrollment data

#### Scenario: Admin views course enrollments
- **WHEN** an admin sends `GET /api/courses/:courseId/enrollments`
- **THEN** the system SHALL return all enrollments with user name, email, progress, and completion status
