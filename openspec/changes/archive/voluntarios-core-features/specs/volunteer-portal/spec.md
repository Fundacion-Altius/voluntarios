## ADDED Requirements

### Requirement: Volunteers have an authenticated portal

The system SHALL provide an authenticated area for volunteers with status `active` where they can view their profile, upcoming bookings, activity history, points, level, badges, certificates, and weekly ranking.

#### Scenario: Volunteer views profile
- **WHEN** an active volunteer logs in
- **THEN** the system SHALL display their profile: name, email, total hours, current level, total points, current streak, badges

#### Scenario: Volunteer sees upcoming bookings
- **WHEN** an active volunteer views their portal
- **THEN** the system SHALL display their upcoming bookings sorted by date
- **THEN** each booking SHALL show: activity name, date, shift, location
- **THEN** a "Cancel" button SHALL be available for bookings more than 24 hours away

#### Scenario: Volunteer sees activity history
- **WHEN** a volunteer views their history
- **THEN** the system SHALL display past check-ins with date, activity, duration, and points earned

#### Scenario: Volunteer sees weekly ranking
- **WHEN** a volunteer views the ranking section
- **THEN** the system SHALL display the current week's top 3 with names
- **THEN** the system SHALL display the volunteer's own position and points

#### Scenario: Volunteer accesses certificate generation
- **WHEN** a volunteer navigates to certificates
- **THEN** the system SHALL show a "Generate certificate" button
- **THEN** the system SHALL allow downloading generated certificates

### Requirement: Volunteer portal requires authentication

All volunteer portal routes SHALL require the user to have status `active` and a valid session.

#### Scenario: Unauthenticated access blocked
- **WHEN** an unauthenticated user tries to access `/portal/`
- **THEN** the system SHALL redirect to login

#### Scenario: Candidate access blocked
- **WHEN** a user with status `candidate` tries to access `/portal/`
- **THEN** the system SHALL display: "Your application is still being reviewed"
