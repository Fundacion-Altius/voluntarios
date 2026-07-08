## Why

Fundación Altius needs to test and approve v2 of the voluntarios app before production release. Currently v1 runs on Render for both frontend and backend. The v2 codebase (on `feat/survey-email` branch) needs a separate, isolated deployment on Vercel for both frontend and backend services so Altius officers can validate the new features without affecting the live v1 deployment.

## What Changes

- **New Vercel project** for both voluntarios-front v2 and voluntarios-back v2, building from `feat/survey-email` branch
- **Frontend config update**: Remove `assetPrefix: '/voluntarios'` and Dockerfile (not needed for Vercel)
- **Backend Docker configuration**: Create `Dockerfile.vercel` optimized for Vercel Fluid Compute
- **Environment variables**: Update both services to use test Supabase database and appropriate SMTP (Mailpit for staging, Office365 for test Supabase)
- **Branch strategy**: Create a `deploy-v2` branch from `feat/survey-email` as the deployable source branch
- **Unified platform**: Both frontend and backend deployed to Vercel for simplified management and preview deployments

## Capabilities

### New Capabilities
- `v2-frontend-deploy`: Vercel deployment configuration for voluntarios-front v2 using Next.js framework
- `v2-backend-deploy`: Vercel deployment configuration for voluntarios-back v2 using Docker containers on Fluid Compute
- `vercel-service-networking`: Private communication between frontend and backend services on Vercel network

### Modified Capabilities
- None (this is deployment infrastructure, not application behavior change)

## Impact

- **voluntarios-front**: `next.config.mjs` → `next.config.ts`, remove `assetPrefix` and Dockerfile, simplify for Vercel
- **voluntarios-back**: New `Dockerfile.vercel` optimized for Fluid Compute, remove Render-specific configs
- **GitHub**: New `deploy-v2` branch in both repos, Vercel connected to that branch for both services
- **Supabase**: Uses existing test project (`voluntarios-test` or similar)
- **DNS**: New Vercel domain (e.g., `voluntarios-v2.vercel.app`) for unified access
- **Deployment**: Simplified single-platform deployment with automatic preview environments

Archived: 2026-07-06