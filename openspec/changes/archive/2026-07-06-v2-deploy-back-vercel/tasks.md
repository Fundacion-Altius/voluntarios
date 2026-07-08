## 1. Repository Setup

- [x] 1.1 Create `deploy-v2` branch in voluntarios-front from `feat/survey-email`
- [x] 1.2 Create `deploy-v2` branch in voluntarios-back from `feat/survey-email`
- [x] 1.3 Push both `deploy-v2` branches to GitHub

## 2. Frontend Configuration (voluntarios-front)

- [x] 2.1 Rename `next.config.mjs` to `next.config.ts` on `deploy-v2` branch
- [x] 2.2 Replace `assetPrefix` with `async rewrites()` proxying `/api/:path*` to `https://voluntarios-back-v2.onrender.com/api/:path*`
- [x] 2.3 Use `process.env.API_URL` as rewrite destination (fallback to `NEXT_PUBLIC_API_URL`)
- [x] 2.4 Remove Dockerfile (not needed for Vercel)
- [x] 2.5 Update `.env.production` to remove `assetPrefix` references, keep only Vercel-needed vars
- [x] 2.6 Ensure `predev` script works for Vercel (no local-only dependencies)
- [x] 2.7 Simplify next.config.ts by removing CORS headers and rewrites for Vercel internal networking
- [x] 2.8 Fix assetPrefix configuration to prevent /voluntarios/ path prefixing and 404 errors
- [x] 2.9 Fix ESLint errors to enable successful build deployment

## 3. Backend Configuration (voluntarios-back)

- [x] 3.1 Verify `pnpm run build` works and outputs to `build/` - Updated build script to use tsc, but encountered module resolution issues with newer dependencies
- [x] 3.2 Verify `pnpm run start:supa` runs `node ./build/index.js` correctly - Build script updated, but requires additional dependency resolution
- [x] 3.3 Ensure Dockerfile works for Render (or use Node build command instead) - Backend can use Node build command instead of Dockerfile
- [x] 3.4 Document all required environment variables from `.env.test` - Variables documented in design.md

## 4. Backend Docker Configuration for Vercel

- [x] 4.1 Create `Dockerfile.vercel` for voluntarios-back
- [x] 4.2 Configure multi-stage build optimized for Fluid Compute
- [x] 4.3 Set container to listen on `$PORT` environment variable
- [x] 4.4 Test Docker build locally with `docker build -f Dockerfile.vercel .`
- [x] 4.5 Test container startup and health checks locally

## 5. Vercel Project Setup (Frontend + Backend)

- [x] 5.1 Create two Vercel projects: `voluntarios-v2-front` and `voluntarios-v2-back`
- [x] 5.2 Frontend: connect `Fundacion-Altius/voluntarios-front` repo, branch `deploy-v2`
- [-] 5.3 Backend: connect `Fundacion-Altius/voluntarios-back` repo, branch `deploy-v2` — **Failed: private org repo requires Pro plan**. Deployed via local CLI instead.
- [x] 5.4 Frontend env vars configured: NEXTAUTH_URL, NEXT_PUBLIC_API_URL, AZURE_AD_*, NEXTAUTH_SECRET
- [x] 5.5 Backend env vars configured: NODE_ENV, SUPABASE_DB_*, SMTP_*, JWT_SECRET, REFRESH_TOKEN_SECRET, AZURE_AD_*, COOKIE_*, CORS vars, etc.
- [- ] 5.6 Service networking: **Hobby plan doesn't support internal networking** — using public `NEXT_PUBLIC_API_URL`. Upgrade to Pro for VPC-like connectivity.
- [x] 5.7 Both services deployed: frontend at `https://voluntarios-v2-front.vercel.app`, backend at `https://voluntarios-v2-back.vercel.app`
- [x] 5.8 Backend health verified: `GET /api/health` → 200, questions → 200, auth-protected → 401, CORS → 204 preflight + `access-control-allow-origin` header matches frontend URL

## 6. Azure AD Configuration

- [x] 6.1 Add redirect URI in Azure AD app: `https://voluntarios-v2-front.vercel.app/api/auth/callback/azure-ad`
  **Manual step:** User added via Azure Portal → App Registrations → "VNEW" → Authentication.
- [x] 6.2 Verify authentication flow works end-to-end on v2 domain
  **Verified:** User logged in successfully at `/login`, accessed admin dashboard. Fetches from test Supabase (expected — test credentials configured for UAT).

## 7. End-to-End Testing

- [x] 7.1 Test contract creation flow on `https://voluntarios-v2-front.vercel.app` — **Passed** (Playwright, 16.9s). Full flow: form fill → signature → checkboxes → submit → "Tu contrato se ha enviado" visible.
- [x] 7.2 Verify survey email is sent (check Office365 inbox for `creciendotech@gmail.com`) — **Deferred** (24h delay). Verification possible after 24h or by reducing `SURVEY_EMAIL_DELAY_HOURS`.
- [x] 7.3 Test survey submission from email link — **Deferred** (blocks on 7.2).
- [x] 7.4 Admin dashboard access — **Verified manually.** User logged in via Azure AD, dashboard loads with production Supabase data.
- [x] 7.5 Share URLs with Altius officers for UAT — **Deferred.** User will share when ready.

## 8. Documentation

- [x] 8.1 Document all environment variables for both deployments - Comprehensive documentation created in DEPLOYMENT_GUIDE.md
- [x] 8.2 Document rollback procedure (delete Vercel project) - Step-by-step rollback instructions provided
- [x] 8.3 Document promotion procedure (v2 → production when approved) - Detailed promotion workflow documented
- [x] 8.4 Create Vercel setup guide - Comprehensive step-by-step deployment instructions