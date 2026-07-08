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
The system SHALL display a line chart of contracts created per month using theme-aware colors.

#### Scenario: Line chart renders with monthly contract data
- **WHEN** the dashboard loads
- **THEN** a line chart SHALL display contract counts grouped by month
- **THEN** the line stroke SHALL use a theme-aware color that is distinct in both light and dark mode (e.g., `--chart-1`)

#### Scenario: Tooltip is readable in dark mode
- **WHEN** the user hovers over a data point in dark mode
- **THEN** the tooltip SHALL display with a dark background and light text for readability

### Requirement: Dashboard shows contracts by location chart
The system SHALL display a bar chart of contracts grouped by location (lugar) using theme-aware colors.

#### Scenario: Bar chart renders with location data
- **WHEN** the dashboard loads
- **THEN** a bar chart SHALL display contract counts grouped by lugar
- **THEN** the bar fill SHALL use a theme-aware color distinct in both light and dark mode (e.g., `--chart-1`)

#### Scenario: Tooltip is readable in dark mode
- **WHEN** the user hovers over a bar in dark mode
- **THEN** the tooltip SHALL display with a dark background and light text for readability

### Requirement: Dashboard shows corporate vs independent breakdown
The system SHALL display a pie or donut chart comparing corporate vs independent volunteers using theme-aware colors.

#### Scenario: Pie chart renders with company data
- **WHEN** the dashboard loads
- **THEN** a pie chart SHALL display the split between contracts with an empresa (corporate) and without (independent)
- **THEN** each slice SHALL use a distinct theme-aware color visible in both light and dark mode (e.g., `--chart-2` and `--chart-5`)

#### Scenario: Tooltip is readable in dark mode
- **WHEN** the user hovers over a pie slice in dark mode
- **THEN** the tooltip SHALL display with a dark background and light text for readability

### Requirement: Dashboard shows recent contracts
The system SHALL display a list of the most recent contracts.

#### Scenario: Recent contracts list renders
- **WHEN** the dashboard loads
- **THEN** the 5 most recent contracts SHALL be displayed with name, empresa, and date
