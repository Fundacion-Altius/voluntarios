## MODIFIED Requirements

### Requirement: Dashboard shows contracts by month chart
The system SHALL display a line chart of contracts created per month using theme-aware colors.

#### Scenario: Line chart renders with monthly contract data
- **WHEN** the dashboard loads
- **THEN** a line chart SHALL display contract counts grouped by month
- **THEN** the line stroke SHALL use a theme-aware color that is distinct in both light and dark mode (e.g., `--chart-1`)

### Requirement: Dashboard shows contracts by location chart
The system SHALL display a bar chart of contracts grouped by location (lugar) using theme-aware colors.

#### Scenario: Bar chart renders with location data
- **WHEN** the dashboard loads
- **THEN** a bar chart SHALL display contract counts grouped by lugar
- **THEN** the bar fill SHALL use a theme-aware color distinct in both light and dark mode (e.g., `--chart-1`)

### Requirement: Dashboard shows corporate vs independent breakdown
The system SHALL display a pie or donut chart comparing corporate vs independent volunteers using theme-aware colors.

#### Scenario: Pie chart renders with company data
- **WHEN** the dashboard loads
- **THEN** a pie chart SHALL display the split between contracts with an empresa (corporate) and without (independent)
- **THEN** each slice SHALL use a distinct theme-aware color visible in both light and dark mode (e.g., `--chart-2` and `--chart-5`)
