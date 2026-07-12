## ADDED Requirements

### Requirement: Completed courses generate certificates

The system SHALL generate a downloadable PDF certificate for each completed course.

#### Scenario: Download course certificate
- **WHEN** an authenticated volunteer sends `GET /api/courses/:courseId/certificate`
- **THEN** if the enrollment status is `"completed"`, the system SHALL return a PDF with the volunteer's name, course title, and completion date
- **THEN** if the course is not completed, the system SHALL return a 403 error

#### Scenario: Certificate content
- **WHEN** a certificate is generated
- **THEN** it SHALL include: volunteer full name, course title, completion date, and foundation name ("Fundación Altius")
- **THEN** it SHALL reuse the existing PDF generation approach from gamificationService
