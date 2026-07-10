## ADDED Requirements

### Requirement: Admin can create activity types

The system SHALL allow admins to create activity types with a name, description, category, default capacity, optional recurrence pattern (days of week + shifts), and optional end date.

#### Scenario: Admin creates a recurring activity type
- **WHEN** an admin creates "Reparto de Alimentos" with recurrence L–S, two shifts (mañana 9-13, tarde 16-20), capacity 15, no end date
- **THEN** the system SHALL create the activity type
- **THEN** the system SHALL materialise sessions for the current and next week based on the pattern

#### Scenario: Admin creates a one-off activity
- **WHEN** an admin creates "Recogida especial 25 Dic" as a one-off activity on 2026-12-25, morning shift, capacity 20
- **THEN** the system SHALL create the activity type
- **THEN** the system SHALL materialise a single session for that date and shift

#### Scenario: Admin edits an activity type
- **WHEN** an admin edits an activity type
- **THEN** the system SHALL update the activity type's metadata
- **THEN** the system SHALL NOT modify already-materialised sessions

#### Scenario: Admin cancels a session
- **WHEN** an admin cancels a specific session
- **THEN** the system SHALL cancel all bookings for that session
- **THEN** the system SHALL notify affected volunteers by email
- **THEN** the session SHALL still appear in the list but marked as cancelled

### Requirement: Admin can manage individual sessions

The system SHALL allow admins to view all materialised sessions, override capacity per session, cancel individual sessions, and manually create ad-hoc sessions.

#### Scenario: Admin overrides capacity for a session
- **WHEN** an admin sets capacity to 25 for a specific session
- **THEN** the system SHALL use that capacity for booking checks instead of the type default

#### Scenario: Admin creates an ad-hoc session
- **WHEN** an admin creates a session for next Tuesday 16-18, capacity 10
- **THEN** the system SHALL create a new session that volunteers can book

### Requirement: Volunteers can book activity sessions

The system SHALL allow active volunteers to browse upcoming sessions and book them, with a maximum of 3 future bookings at a time.

#### Scenario: Volunteer books a session
- **WHEN** a volunteer with status `active` books a session with available capacity
- **THEN** the system SHALL create a booking with status `confirmed`
- **THEN** the system SHALL decrement the available capacity
- **THEN** the volunteer SHALL see the booking in their upcoming activities list

#### Scenario: Volunteer reaches booking limit
- **WHEN** a volunteer already has 3 confirmed future bookings and tries to book another
- **THEN** the system SHALL reject the booking
- **THEN** the system SHALL display: "You already have 3 upcoming bookings. Cancel one to book another."

#### Scenario: Session is fully booked, volunteer joins waitlist
- **WHEN** a volunteer tries to book a fully booked session
- **THEN** the system SHALL offer to join the waitlist
- **THEN** if accepted, the system SHALL add them to the waitlist with position N+1

#### Scenario: Volunteer cancels a booking
- **WHEN** a volunteer cancels a booking more than 24 hours before the session
- **THEN** the system SHALL mark the booking as cancelled
- **THEN** the system SHALL free the capacity slot
- **THEN** if there is a waitlist, the system SHALL notify the next person in line

#### Scenario: Volunteer cancels too late
- **WHEN** a volunteer cancels a booking less than 24 hours before the session
- **THEN** the system SHALL mark the booking as cancelled
- **THEN** the system SHALL count this as a no-show for penalty purposes

### Requirement: No-show penalties apply

The system SHALL track no-shows and enforce a 7-day booking ban after 2 consecutive no-shows.

#### Scenario: First no-show
- **WHEN** a volunteer does not check in to a booked session
- **THEN** the system SHALL record a no-show
- **THEN** the system SHALL NOT restrict future bookings yet

#### Scenario: Two consecutive no-shows trigger penalty
- **WHEN** a volunteer has 2 consecutive no-shows (no check-in, no cancellation 24h+ before)
- **THEN** the system SHALL ban the volunteer from booking for 7 days
- **THEN** the system SHALL notify the volunteer by email about the penalty

### Requirement: Check-in and check-out via admin dashboard

The system SHALL allow admins to manually check volunteers in and out from a session attendance view.

#### Scenario: Admin checks in a volunteer
- **WHEN** an admin clicks "Check-in" next to a volunteer's name for a session
- **THEN** the system SHALL record the check-in time
- **THEN** the volunteer SHALL appear as checked in

#### Scenario: Admin checks out a volunteer
- **WHEN** an admin clicks "Check-out" next to a checked-in volunteer
- **THEN** the system SHALL record the check-out time
- **THEN** the system SHALL calculate the duration in minutes
- **THEN** the system SHALL trigger point calculation based on actual hours attended

### Requirement: QR code check-in

The system SHALL generate a unique QR code per booking that volunteers can display for scanning by the admin.

#### Scenario: Admin scans QR for check-in
- **WHEN** an admin scans a volunteer's QR code
- **THEN** the system SHALL identify the booking
- **THEN** the system SHALL record the check-in time

#### Scenario: Admin scans QR for check-out
- **WHEN** an admin scans a volunteer's QR code for a second time (already checked in)
- **THEN** the system SHALL record the check-out time
- **THEN** the system SHALL calculate the duration in minutes

#### Scenario: Invalid QR code scanned
- **WHEN** an admin scans an invalid or expired QR code
- **THEN** the system SHALL display an error message
