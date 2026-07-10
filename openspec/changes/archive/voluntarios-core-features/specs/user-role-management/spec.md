## ADDED Requirements

### Requirement: User status follows a defined lifecycle

The system SHALL enforce the following status transitions: `candidate` → `active` (on admin approval), `candidate` → `on-reserve` (on admin decision), `active` → `inactive` (on admin deactivation), `on-reserve` → `active` (on admin activation). All transitions SHALL be logged.

#### Scenario: Candidate is approved to active
- **WHEN** an admin approves a candidate
- **THEN** the system SHALL change status from `candidate` to `active`
- **THEN** the system SHALL send an acceptance email with password setup link

#### Scenario: Candidate is moved to reserve
- **WHEN** an admin puts a candidate on reserve
- **THEN** the system SHALL change status from `candidate` to `on-reserve`
- **THEN** the system SHALL send a notification email

#### Scenario: Active volunteer is deactivated
- **WHEN** an admin deactivates a volunteer
- **THEN** the system SHALL change status from `active` to `inactive`
- **THEN** the system SHALL cancel all future bookings
- **THEN** the system SHALL send a notification email

#### Scenario: On-reserve volunteer is activated
- **WHEN** an admin activates a volunteer from reserve
- **THEN** the system SHALL change status from `on-reserve` to `active`
- **THEN** the system SHALL send an acceptance email with password setup link
