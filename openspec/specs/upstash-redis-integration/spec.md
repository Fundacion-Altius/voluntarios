## Purpose

Integration with Upstash Redis for serverless Bull queue support in production environments.

## Requirements

### Requirement: Scheduler uses Upstash Redis credentials in production
The scheduler SHALL connect to Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are provided in the environment.

#### Scenario: production scheduler connects to Upstash
- **WHEN** environment has `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- **THEN** the Bull queue SHALL connect to `redis://<token>@<host>.upstash.io`

### Requirement: Environment variables configured for production
The `.env.production` file SHALL contain the Upstash Redis REST endpoint and token.

#### Scenario: upstash vars present in production env
- **WHEN** `.env.production` is loaded
- **THEN** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` SHALL be defined
