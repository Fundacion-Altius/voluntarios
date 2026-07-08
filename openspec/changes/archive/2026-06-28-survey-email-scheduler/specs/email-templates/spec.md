## ADDED Requirements

### Requirement: Survey invitation email template
The system SHALL provide an HTML email template for the survey invitation that includes branding and survey link.

#### Scenario: Email template renders with volunteer name
- **WHEN** the email is generated for a volunteer named "John"
- **THEN** the email body includes "Hola John" in the greeting

#### Scenario: Email template includes survey link
- **WHEN** the email is generated
- **THEN** the email body includes a clickable link to `/encuesta`

#### Scenario: Email template includes organization branding
- **WHEN** the email is generated
- **THEN** the email body includes the Fundación Altius logo and branding colors

### Requirement: Email template is configurable
The system SHALL load email templates from a dedicated directory, allowing editing without code changes.

#### Scenario: Template is loaded from file
- **WHEN** an email is generated
- **THEN** the system loads the template from `src/email-templates/survey-invitation.html`
