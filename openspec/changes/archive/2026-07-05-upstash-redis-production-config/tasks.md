## 1. Configuration

- [x] 1.1 Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.production
- [x] 1.2 Verify .env.production variables match Upstash credentials provided

## 2. Scheduler Implementation

- [x] 2.1 Modify surveyEmailScheduler.ts to use Upstash Redis URL format in production
- [x] 2.2 Update createBullScheduler to construct redis URL from Upstash REST endpoint and token
- [x] 2.3 Add fallback to standard REDIS_URL if Upstash vars not present

## 3. Verification

- [x] 3.1 Run pnpm typecheck to verify TypeScript compiles
- [x] 3.2 Run pnpm run staging to verify scheduler loads correctly
- [x] 3.3 Verify Upstash Redis connection works with test job