# Admin Dashboard Page

## Purpose

Provide a KPI dashboard at `/dashboard` with charts and metrics overviewing contracts and survey data.

## Requirements

### Requirement: Dashboard shows KPI metric cards
The system SHALL display key performance indicator cards at `/dashboard`.

#### Scenario: Dashboard renders metric cards
- **WHEN** an admin navigates to `/dashboard`
- **THEN** metric cards SHALL be displayed for: total contracts, active volunteers, survey completion rate

#### Scenario: Metric cards show numeric values
- **WHEN** the dashboard loads
- **THEN** each metric card SHALL display a numeric value and a label

### Requirement: Dashboard shows contracts by month chart
The system SHALL display a line chart of contracts created per month.

#### Scenario: Line chart renders with monthly contract data
- **WHEN** the dashboard loads
- **THEN** a line chart SHALL display contract counts grouped by month

### Requirement: Dashboard shows contracts by location chart
The system SHALL display a bar chart of contracts grouped by location (lugar).

#### Scenario: Bar chart renders with location data
- **WHEN** the dashboard loads
- **THEN** a bar chart SHALL display contract counts grouped by lugar

### Requirement: Dashboard shows corporate vs independent breakdown
The system SHALL display a pie or donut chart comparing corporate vs independent volunteers.

#### Scenario: Pie chart renders with company data
- **WHEN** the dashboard loads
- **THEN** a pie chart SHALL display the split between contracts with an empresa (corporate) and without (independent)

### Requirement: Dashboard shows recent contracts
The system SHALL display a list of the most recent contracts.

#### Scenario: Recent contracts list renders
- **WHEN** the dashboard loads
- **THEN** the 5 most recent contracts SHALL be displayed with name, empresa, and date
