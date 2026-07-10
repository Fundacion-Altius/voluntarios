## ADDED Requirements

### Requirement: Points are earned per hour of activity

The system SHALL award points based on actual check-in duration at a rate of 10 points per hour, rounded down. Points SHALL only be calculated after check-out. Bonuses SHALL apply: +2 for Saturday sessions, +3 for logistics category activities.

#### Scenario: Points awarded on check-out
- **WHEN** a volunteer checks out after 3 hours and 27 minutes of a regular weekday activity
- **THEN** the system SHALL award 30 points (floor(207 min / 60) × 10)

#### Scenario: Saturday bonus applied
- **WHEN** a volunteer checks out after 2 hours of a Saturday activity
- **THEN** the system SHALL award 20 base points + 4 Saturday bonus = 24 points

#### Scenario: Logistics bonus applied
- **WHEN** a volunteer checks out after 1 hour of a logistics activity
- **THEN** the system SHALL award 10 base points + 3 logistics bonus = 13 points

#### Scenario: Bonus stacking
- **WHEN** a volunteer checks out after 2 hours of a Saturday logistics activity
- **THEN** the system SHALL award 20 base points + 4 Saturday bonus + 3 logistics bonus = 27 points

### Requirement: Streaks track consecutive weekly participation

The system SHALL track the number of consecutive weeks a volunteer has checked into at least one activity. A week runs Monday to Sunday.

#### Scenario: 2-week streak bonus
- **WHEN** a volunteer checks in to an activity for the second consecutive week
- **THEN** the system SHALL apply a 50-point streak bonus
- **THEN** the streak counter SHALL show 2 weeks

#### Scenario: 4-week streak bonus
- **WHEN** a volunteer reaches 4 consecutive weeks
- **THEN** the system SHALL apply a 150-point streak bonus
- **THEN** the streak counter SHALL show 4 weeks

#### Scenario: 8-week streak bonus
- **WHEN** a volunteer reaches 8 consecutive weeks
- **THEN** the system SHALL apply a 500-point streak bonus
- **THEN** the system SHALL award the "Fiel" badge
- **THEN** the streak counter SHALL show 8 weeks

#### Scenario: Streak resets on missed week
- **WHEN** a volunteer has no check-ins for a full calendar week (Mon–Sun)
- **THEN** the system SHALL reset the streak counter to 0
- **THEN** the volunteer SHALL NOT lose any accumulated points or badges

### Requirement: Levels are based on total accumulated points

The system SHALL define four levels based on lifetime points: Bronce (0–499), Plata (500–1499), Oro (1500–2999), Diamante (3000+). Levels SHALL never decrease.

#### Scenario: Volunteer reaches Silver level
- **WHEN** a volunteer's total accumulated points reach 500
- **THEN** the system SHALL promote the volunteer to Plata level
- **THEN** the system SHALL unlock the ability to publish in the feed
- **THEN** the system SHALL notify the volunteer of their new level

#### Scenario: Volunteer reaches Gold level
- **WHEN** a volunteer's total accumulated points reach 1500
- **THEN** the system SHALL promote the volunteer to Oro level
- **THEN** the system SHALL notify the volunteer

#### Scenario: Level does not decrease
- **WHEN** a volunteer has 2000 total points (Oro)
- **THEN** even if they stop participating, their level SHALL remain Oro

### Requirement: Weekly ranking publishes top 3

The system SHALL calculate a weekly ranking from Monday to Sunday based on points earned that week only. The top 3 volunteers (with names) SHALL be published every Monday at 8:00 AM.

#### Scenario: Weekly ranking calculation
- **WHEN** Monday 8:00 AM arrives
- **THEN** the system SHALL calculate points earned by each volunteer from Mon 00:00 to Sun 23:59
- **THEN** the system SHALL determine the top 3 by points
- **THEN** the system SHALL publish the ranking with names visible

#### Scenario: Volunteer sees their position
- **WHEN** a volunteer views the ranking section
- **THEN** they SHALL see the top 3 with names
- **THEN** they SHALL see their own position and points for the week
- **THEN** if they are not in the top 3, their name SHALL NOT be visible to others

### Requirement: Badges are awarded for achievements

The system SHALL award badges for specific achievements that are permanently visible on the volunteer's profile.

#### Scenario: Badge types exist
- **WHEN** a volunteer triggers a badge condition
- **THEN** the system SHALL award the corresponding badge
- **THEN** the badge SHALL appear on their profile permanently

Badge conditions:
- "Primer check-in": first check-in ever
- "50 horas": 50 total hours accumulated
- "100 horas": 100 total hours accumulated
- "500 horas": 500 total hours accumulated
- "Madrugador": 5 check-ins before 8:00 AM
- "Versátil": participated in 3 or more different activity categories
- "Fiel": 8-week streak achieved

### Requirement: Volunteers can download certificates

The system SHALL generate a PDF certificate with the volunteer's name, total hours, level, and a QR verification code.

#### Scenario: Volunteer generates certificate
- **WHEN** a volunteer clicks "Generate certificate"
- **THEN** the system SHALL generate a PDF with: volunteer name, total hours, current level, and a unique verification code
- **THEN** the volunteer SHALL be able to download the PDF

### Requirement: Volunteers can share achievements on social media

The system SHALL generate a shareable image card with the volunteer's level, total hours, and badges.

#### Scenario: Volunteer shares achievement
- **WHEN** a volunteer clicks "Share on social media"
- **THEN** the system SHALL generate an image card
- **THEN** the volunteer SHALL be able to download it for posting on Instagram, LinkedIn, etc.
