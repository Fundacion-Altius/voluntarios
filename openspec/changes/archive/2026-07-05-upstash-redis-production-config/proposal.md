## Why

Vercel serverless functions cannot run background processes like Redis containers. To deploy the backend to Vercel for production, we need to configure Upstash Redis (serverless Redis) for the Bull queue that handles delayed survey email scheduling.

## What Changes

- Configure Upstash Redis REST endpoint and token as production environment variables (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
- Update Redis connection logic in `surveyEmailScheduler.ts` to support Upstash Redis protocol format
- Add Upstash configuration to `.env.production` for production deployments
- Ensure Bull queue connects to Upstash instead of local Redis in production environment

## Capabilities

### New Capabilities
- `upstash-redis-integration`: Integration with Upstash Redis for serverless Bull queue support

### Modified Capabilities
- `survey-email-scheduling`: Accept Upstash Redis credentials in production environment

## Impact

- Affected code: `src/services/surveyEmailScheduler.ts` (Redis connection configuration)
- Affected files: `.env.production` (add Upstash environment variables)
- Dependencies: Upstash Redis credentials for production deployment
- Systems: Bull queue will connect to Upstash Redis in production instead of local Redis

Archived: 2026-07-05