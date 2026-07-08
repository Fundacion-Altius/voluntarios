# Purpose
Manage environment variables and API endpoint configuration across deployment stages (production, preview, development) using Vercel's environment variable system.

## Requirements

### Requirement: Environment variable management
The system SHALL manage environment variables for different deployment stages.

#### Scenario: Production variables
- **WHEN** production deployment occurs
- **THEN** production environment variables are used

#### Scenario: Preview variables
- **WHEN** preview deployment occurs
- **THEN** staging/preview environment variables are used

### Requirement: API endpoint configuration
The system SHALL configure API endpoints based on environment.

#### Scenario: Production API endpoint
- **WHEN** running in production
- **THEN** API requests are sent to production backend URL from `NEXT_PUBLIC_API_URL`

#### Scenario: Preview API endpoint
- **WHEN** running in preview/staging
- **THEN** API requests are sent to preview backend URL

### Requirement: Feature flags
The system SHALL support feature flags for gradual rollouts.

#### Scenario: Feature flag configuration
- **WHEN** feature flags are set via environment variables
- **THEN** corresponding features are enabled/disabled

#### Scenario: Environment-specific features
- **WHEN** running in different environments
- **THEN** environment-appropriate features are available
