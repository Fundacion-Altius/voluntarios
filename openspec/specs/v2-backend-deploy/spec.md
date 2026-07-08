# Purpose
Deploy the voluntarios-back Express + TypeScript backend to Vercel using Docker (Fluid Compute) for the v2 release, using production Supabase database and Office365 SMTP.

## Requirements

### Requirement: Backend deployed to Vercel using Docker containers
The system SHALL deploy voluntarios-back to Vercel using Docker containers with Fluid Compute.

#### Scenario: Vercel project configured with Docker service
- **WHEN** Vercel project is created (`voluntarios-v2-back`)
- **THEN** the project SHALL use `Dockerfile.vercel` as the build definition
- **THEN** the service SHALL use branch `deploy-v2` as the deployment branch (or manual CLI deploy when repo cannot be connected)

#### Scenario: Dockerfile.vercel builds production image
- **WHEN** Vercel builds the Docker image
- **THEN** the build SHALL use multi-stage build optimization
- **THEN** the final image SHALL be minimal and production-ready (devDependencies pruned)

#### Scenario: Container listens on $PORT
- **WHEN** container starts
- **THEN** the backend SHALL listen on the port specified in `$PORT` environment variable (default 3001)
- **THEN** health check endpoint SHALL respond at `GET /api/health`

### Requirement: Backend environment variables configured on Vercel
The system SHALL have all required environment variables configured in Vercel project settings.

#### Scenario: Production environment variables present
- **WHEN** Vercel project settings are inspected
- **THEN** the following variables SHALL be set:
  - `NODE_ENV=production`
  - `SUPABASE_DB_*` (production Supabase credentials)
  - `SMTP_*` (Office365 live email)
  - `AZURE_AD_*` (tenant, client ID, client secret)
  - `JWT_SECRET` / `REFRESH_TOKEN_SECRET`
  - `FRONTEND_URL=https://voluntarios-v2-front.vercel.app`
  - `COOKIE_SECURE=true`, `COOKIE_DOMAIN=.vercel.app`
  - `SURVEY_BASE_URL=https://voluntarios-v2-front.vercel.app`

#### Scenario: Vercel env vars override .env files
- **WHEN** Vercel service runs
- **THEN** Vercel environment variables SHALL take precedence over any `.env.*` files in the repository

### Requirement: Backend API accessible at public URL
The system SHALL serve the backend API at `https://voluntarios-v2-back.vercel.app`.

#### Scenario: Health endpoint responds
- **WHEN** GET request to `https://voluntarios-v2-back.vercel.app/api/health`
- **THEN** response SHALL be 200 OK with health status JSON

#### Scenario: Public API endpoints accessible
- **WHEN** GET request to `https://voluntarios-v2-back.vercel.app/api/questions`
- **THEN** response SHALL be 200 OK with questions array

#### Scenario: Protected endpoints require auth
- **WHEN** GET request to `https://voluntarios-v2-back.vercel.app/api/surveys` without auth
- **THEN** response SHALL be 401 Unauthorized
