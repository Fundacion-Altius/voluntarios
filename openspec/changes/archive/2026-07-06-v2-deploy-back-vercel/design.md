## Context

**Current state (v1):**
- voluntarios-front deployed on Render at `voluntarios-front.onrender.com`
- Uses `assetPrefix: '/voluntarios'` and serves from subpath
- voluntarios-back deployed on Render at `voluntarios-back.onrender.com`
- Both use production Supabase database
- Single branch `main` deployed to production

**Target state (v2) - Updated for Vercel-only deployment:**
- voluntarios-front v2 on Vercel at `voluntarios-v2.vercel.app` (or custom domain)
- voluntarios-back v2 on Vercel using Docker containers (Fluid Compute)
- Both services in the same Vercel project for unified management
- Frontend and backend communicate privately on Vercel network
- Both use test Supabase database
- Deployed from dedicated `deploy-v2` branch

**Constraints:**
- Must not affect v1 production deployment
- Altius officers need to test v2 independently
- Use existing test Supabase project and Mailpit/Office365 SMTP configs
- Frontend and backend can communicate directly on Vercel network (no need for rewrites/CORS)

## Goals / Non-Goals

**Goals:**
- Deploy v2 frontend to Vercel with standard Next.js build
- Deploy v2 backend to Vercel using Docker containers (Fluid Compute)
- Configure both services in the same Vercel project
- Create `deploy-v2` branch in both repos as deployment source
- Document all environment variables needed for both services
- Verify end-to-end contract creation → email flow works on v2
- Leverage Vercel's private networking between services

**Non-Goals:**
- No changes to application code/logic (only config)
- No database migrations (uses existing test Supabase)
- No CI/CD pipeline changes (Vercel handles builds)
- No "build-only branch" pattern — not needed for Vercel
- No custom domain setup initially (use default Vercel URLs)

## Decisions

### 1. Vercel for Frontend (standard build)
**Decision:** Use Vercel's native Next.js support — connect GitHub repo, point to `deploy-v2` branch, let Vercel run `pnpm run build`.

**Why:** Vercel is purpose-built for Next.js. Zero config, automatic ISR/SSR, preview deployments, edge functions. No need to push build artifacts to git.

**Alternative considered:** Build locally, push `.next/` to a deploy branch. Rejected — adds complexity, loses Vercel optimizations, breaks preview deployments.

### 2. Vercel for Backend (Docker containers)
**Decision:** Deploy backend to Vercel using Docker containers with `Dockerfile.vercel`. Use Vercel's Fluid Compute platform for containerized backend services.

**Why:** 
- Unified platform for full stack deployment
- Automatic preview deployments for backend with every push
- Private networking between frontend and backend services
- Active CPU pricing model (pay only for actual usage)
- Simplified CI/CD with single platform
- Built-in observability and monitoring

**Alternative considered:** Continue with Render for backend. Rejected — adds platform complexity, loses unified preview deployments and private networking.

### 3. Direct Service Communication on Vercel Network
**Decision:** Frontend calls backend directly using internal Vercel service URLs. No need for API proxy rewrites or CORS configuration.

**Why:** 
- Private, secure communication within Vercel network
- No latency or complexity of external API calls
- Automatic service discovery and networking
- Simpler configuration than rewrites or CORS

**Alternative considered:** API proxy rewrites or CORS. Rejected — unnecessary complexity when services can communicate directly on same platform.

### 4. Single Deploy Branch (`deploy-v2`)
**Decision:** Create `deploy-v2` branch from `feat/survey-email` in both repos. Vercel project points to this branch for both frontend and backend services.

**Why:** Clean separation between development branches and deployment source. Allows hotfixes to deploy branch without affecting feature branches. Standard GitOps pattern.

**Alternative considered:** Deploy from `feat/survey-email` directly. Rejected — feature branch may have WIP commits, not stable for demos.

### 5. Test Supabase for Both
**Decision:** Both v2 frontend and backend use the test Supabase project (credentials in `.env.test`).

**Why:** Isolated from production data. Altius can test with real data shapes without affecting prod. Matches existing `dev:supa:test` script.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Vercel preview deployments create many URLs | Use `deploy-v2` branch only for production preview; feature branches get auto previews but aren't shared with Altius |
| Environment variable drift between local/test/prod | Document all required vars in this design; use `.env.example` as source of truth |
| Vercel Fluid Compute cold starts | Acceptable for testing; configure minimum instances if needed |
| Next-auth callback URLs must match Vercel domain | Configure `NEXTAUTH_URL=https://voluntarios-v2.vercel.app` and Azure AD redirect URIs accordingly |
| Backend service discovery in Vercel | Use Vercel's internal service URLs for direct communication between services |

## Migration Plan

1. **Create `deploy-v2` branch** in both repos from `feat/survey-email`
2. **Update frontend config** on `deploy-v2`:
   - Rename `next.config.mjs` → `next.config.ts`
   - Remove `assetPrefix` (not needed on Vercel)
   - Remove Dockerfile (not needed for Vercel)
3. **Create `Dockerfile.vercel`** for backend:
   - Multi-stage build optimized for Vercel Fluid Compute
   - Configure to listen on `$PORT` environment variable
   - Minimal production image with only runtime dependencies
4. **Create Vercel project** with both services:
   - Connect `voluntarios-front` repo, `deploy-v2` branch for frontend
   - Connect `voluntarios-back` repo, `deploy-v2` branch for backend
   - Framework preset: Next.js for frontend, Docker for backend
   - Add env vars from `.env.test` for backend, `.env.production` for frontend
5. **Configure service networking** in Vercel:
   - Set up private communication between frontend and backend services
   - Use Vercel internal URLs for API calls (no public exposure needed)
6. **Configure Azure AD** redirect URIs for new Vercel domain
7. **Test end-to-end**: Create contract → verify email sent → complete survey
8. **Share URLs** with Altius officers for approval

**Rollback:** Delete Vercel project. v1 unchanged.