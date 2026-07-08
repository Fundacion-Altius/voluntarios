## Context

The backend uses Bull queue for delayed survey email scheduling in staging/production environments. Currently, it connects to a local Redis instance via `REDIS_URL=redis://localhost:6379`. Vercel serverless functions cannot run background Redis containers, requiring a managed Redis solution.

## Goals / Non-Goals

**Goals:**
- Configure Upstash Redis as the production Redis backend for Bull queue
- Enable Vercel deployment without Docker Redis dependency
- Maintain backward compatibility with local Redis for staging

**Non-Goals:**
- Migrate from Bull to BullMQ (queue logic changes)
- Modify email scheduling behavior beyond connection changes

## Decisions

1. **Use Upstash Redis URL format for ioredis**: Upstash provides a REST endpoint but also supports standard Redis protocol. Convert `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into a standard Redis connection URL for ioredis compatibility.

2. **Environment variable strategy**: Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env.production`. The scheduler will construct the Bull queue connection URL from these.

3. **Connection format**: Upstash Redis supports `redis://<token>@<host>.upstash.io` format. Extract host from REST URL and build the connection string.

## Risks / Trade-offs

- **Upstash pricing**: Pay-per-operation model could increase costs with high email volume → Mitigated by monitoring usage
- **Connection latency**: Upstash has higher latency than local Redis → Acceptable for 24h delayed jobs
- **Regional latency**: If Upstash region differs from Vercel region → Mitigated by selecting same-region Upstash