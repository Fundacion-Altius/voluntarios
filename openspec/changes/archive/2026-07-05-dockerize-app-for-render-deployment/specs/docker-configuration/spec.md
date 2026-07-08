## ADDED Requirements

### Requirement: Dockerfile for backend service
The system SHALL provide a Dockerfile for the voluntarios-back service that produces a production-ready container image.

#### Scenario: Backend Docker build succeeds
- **WHEN** docker build is executed in voluntarios-back directory
- **THEN** a functional container image is created with the backend service

#### Scenario: Backend container starts successfully
- **WHEN** the backend container is started with required environment variables
- **THEN** the Express server starts and listens on the configured port

### Requirement: Dockerfile for frontend service
The system SHALL provide a Dockerfile for the voluntarios-front service that produces a production-ready container image.

#### Scenario: Frontend Docker build succeeds
- **WHEN** docker build is executed in voluntarios-front directory
- **THEN** a functional container image is created with the Next.js application

#### Scenario: Frontend container starts successfully
- **WHEN** the frontend container is started with required environment variables
- **THEN** the Next.js server starts and serves the application on the configured port

### Requirement: Docker Compose configuration
The system SHALL provide a docker-compose.yml file that orchestrates all required services for local development.

#### Scenario: Full stack startup with docker-compose
- **WHEN** docker-compose up is executed
- **THEN** all services (backend, frontend, Postgres, Redis) start successfully

#### Scenario: Service networking between containers
- **WHEN** frontend container makes API requests to backend container
- **THEN** requests are successfully routed using docker-compose service names

### Requirement: Environment variable configuration
The system SHALL support configuration through environment variables for both development and production Docker environments.

#### Scenario: Environment variables are loaded in containers
- **WHEN** containers start with .env files or environment variable arguments
- **THEN** applications correctly read and use the configured environment variables

### Requirement: Build optimization with .dockerignore
The system SHALL include .dockerignore files to exclude unnecessary files from Docker build context.

#### Scenario: Optimized build context
- **WHEN** Docker build is executed
- **THEN** node_modules, .git, and other excluded directories are not included in build context