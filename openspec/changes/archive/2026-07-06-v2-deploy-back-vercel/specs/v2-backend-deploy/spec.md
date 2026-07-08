## ADDED Requirements

### Requirement: Backend deployed to Vercel using Docker containers
The system SHALL deploy the voluntarios-back application to Vercel using Docker containers with Fluid Compute, using the `deploy-v2` branch as the deployment source.

#### Scenario: Vercel project configured with Docker service
- **WHEN** Vercel project is created with GitHub repository `Fundacion-Altius/voluntarios-back`
- **THEN** the project SHALL include a Docker service using `Dockerfile.vercel`
- **THEN** the service SHALL use branch `deploy-v2` as the deployment branch

#### Scenario: Dockerfile.vercel builds production image
- **WHEN** Vercel builds the Docker image
- **THEN** the build SHALL use multi-stage build optimization
- **THEN** the final image SHALL be minimal and production-ready

#### Scenario: Container listens on $PORT
- **WHEN** container starts
- **THEN** the backend SHALL listen on the port specified in `$PORT` environment variable
- **THEN** the container SHALL respond to health checks on the specified port

#### Scenario: Build produces optimized container
- **WHEN** `docker build -f Dockerfile.vercel` executes
- **THEN** the build SHALL complete successfully
- **THEN** the resulting image SHALL be optimized for Vercel Fluid Compute

### Requirement: Backend environment variables configured on Vercel
The system SHALL have all required environment variables configured in Vercel project settings for the v2 deployment.

#### Scenario: Required environment variables present
- **WHEN** Vercel project settings are inspected
- **THEN** the following variables SHALL be set from `.env.test`:
  - `NODE_ENV=production`
  - `PORT=3001` (or use Vercel's `$PORT`)
  - `SUPABASE_DB_*` (Supabase test database credentials)
  - `SMTP_*` (Mailpit for staging or Office365 for test Supabase)
  - `AZURE_AD_*` (for any backend auth needs)
  - `JWT_SECRET` / `REFRESH_SECRET`

#### Scenario: Vercel environment variables take precedence
- **WHEN** Vercel service runs
- **THEN** Vercel environment variables SHALL take precedence over any `.env.*` files in the repository

### Requirement: Backend API accessible via Vercel internal networking
The system SHALL serve the backend API via Vercel's internal service networking.

#### Scenario: Health endpoint responds internally
- **WHEN** GET request to internal Vercel service URL `/health`
- **THEN** response SHALL be 200 OK with health status

#### Scenario: API endpoints accessible internally
- **WHEN** requests made to internal Vercel service URL `/api/*`
- **THEN** endpoints SHALL respond per API specification (surveys, contracts, users, etc.)

#### Scenario: Private service communication
- **WHEN** frontend service calls backend service
- **THEN** communication SHALL occur over Vercel's private network
- **THEN** no public internet exposure SHALL be required for service-to-service communication