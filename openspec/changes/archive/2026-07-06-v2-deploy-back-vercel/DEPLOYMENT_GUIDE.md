# v2 Deployment Guide for Fundación Altius

This guide provides step-by-step instructions for deploying the v2 voluntarios application to Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub access to `Fundacion-Altius/voluntarios-front` and `Fundacion-Altius/voluntarios-back` repositories
- Render account with billing set up
- Vercel account with billing set up
- Azure AD admin access for redirect URI configuration
- Access to test Supabase database credentials

## 1. Backend Deployment to Render

### 1.1 Create New Render Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect to `Fundacion-Altius/voluntarios-back` repository
5. Select branch: `deploy-v2`
6. Name: `voluntarios-back-v2`
7. Region: `Ohio (us-east-1)` (recommended for best latency with Vercel)

### 1.2 Configure Build Settings

**Build Command:**
```bash
pnpm install && pnpm run build
```

**Start Command:**
```bash
pnpm run start:supa
```

### 1.3 Set Environment Variables

Add the following environment variables from `.env.test`:

```env
# Core Configuration
NODE_ENV=production
PORT=3001

# Database (Test Supabase)
SUPABASE_DB_HOST=<from .env.test>
SUPABASE_DB_PORT=<from .env.test>
SUPABASE_DB_USER=<from .env.test>
SUPABASE_DB_PASSWORD=<from .env.test>
SUPABASE_DB_DATABASE=<from .env.test>

# SMTP Configuration (Office365 for test Supabase)
SMTP_HOST=<from .env.test>
SMTP_PORT=<from .env.test>
SMTP_USER=<from .env.test>
SMTP_PASS=<from .env.test>
SMTP_FROM=<from .env.test>

# Authentication
JWT_SECRET=<from .env.test>
REFRESH_SECRET=<from .env.test>
AZURE_AD_TENANT_ID=<from .env.test>
AZURE_AD_CLIENT_ID=<from .env.test>
AZURE_AD_CLIENT_SECRET=<from .env.test>

# CORS Configuration
CORS_ORIGIN=https://voluntarios-v2.vercel.app
```

### 1.4 Deploy and Verify

1. Click "Create Web Service"
2. Wait for build to complete (approximately 5-10 minutes)
3. Verify health endpoint:
   ```bash
   curl https://voluntarios-back-v2.onrender.com/health
   ```
   Expected response: `{"status":"healthy"}`

4. Test API endpoints:
   ```bash
   curl https://voluntarios-back-v2.onrender.com/api/surveys
   ```

## 2. Frontend Deployment to Vercel

### 2.1 Create New Vercel Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import `Fundacion-Altius/voluntarios-front` repository
4. Select branch: `deploy-v2`
5. Project Name: `voluntarios-v2`
6. Framework Preset: Next.js (auto-detected)

### 2.2 Configure Environment Variables

Add the following environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://voluntarios-v2.vercel.app
NEXTAUTH_SECRET=znFZaGwYMHx0Yp9tVdQV257leVdFLovuAj/9W2B/4KM=

# Azure AD Configuration
AZURE_AD_TENANT_ID=<from .env.test>
AZURE_AD_CLIENT_ID=<from .env.test>
AZURE_AD_CLIENT_SECRET=<from .env.test>

# API Configuration
API_URL=https://voluntarios-back-v2.onrender.com
NEXT_PUBLIC_API_URL=https://voluntarios-back-v2.onrender.com
```

### 2.3 Deploy and Verify

1. Click "Deploy"
2. Wait for deployment to complete (approximately 2-5 minutes)
3. Verify frontend loads:
   - Navigate to `https://voluntarios-v2.vercel.app/`
   - Should display the contract wizard

## 3. Azure AD Configuration

### 3.1 Add Redirect URI

1. Log in to [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure AD → App registrations
3. Select the voluntarios application
4. Go to "Authentication" → "Redirect URIs"
5. Add new redirect URI:
   ```
   https://voluntarios-v2.vercel.app/api/auth/callback/azure-ad
   ```
6. Save changes

### 3.2 Test Authentication Flow

1. Navigate to `https://voluntarios-v2.vercel.app/`
2. Click login button
3. Complete Azure AD authentication
4. Verify successful redirect back to frontend

## 4. End-to-End Testing

### 4.1 Test Contract Creation Flow

1. Navigate to `https://voluntarios-v2.vercel.app/`
2. Complete the contract wizard with test data
3. Submit the contract
4. Verify contract is created in test Supabase database

### 4.2 Verify Survey Email

1. Check Mailpit (staging) or Office365 (test Supabase) for survey email
2. Verify email contains correct survey link
3. Verify email template matches expectations

### 4.3 Test Survey Submission

1. Open survey link from email
2. Complete survey with test ratings
3. Submit survey
4. Verify survey submission is recorded in database

### 4.4 Test Admin Dashboard

1. Log in as admin user
2. Navigate to admin dashboard
3. Verify access to:
   - Surveys list
   - Contracts list
   - Users management
   - Survey reports

## 5. Documentation

### 5.1 Environment Variables Reference

**Backend (Render):**
- See `.env.test` and `.env.example` in voluntarios-back repository

**Frontend (Vercel):**
- See `.env.production` in voluntarios-front repository

### 5.2 Rollback Procedure

**To rollback v2 deployment:**

1. **Backend Rollback:**
   - Delete `voluntarios-back-v2` service from Render dashboard
   - v1 backend remains unaffected

2. **Frontend Rollback:**
   - Delete `voluntarios-v2` project from Vercel dashboard
   - v1 frontend remains unaffected

3. **Azure AD Rollback:**
   - Remove `https://voluntarios-v2.vercel.app/api/auth/callback/azure-ad` redirect URI

### 5.3 Promotion Procedure

**To promote v2 to production:**

1. **Merge deploy-v2 branch to main:**
   ```bash
   git checkout main
   git merge deploy-v2
   git push origin main
   ```

2. **Update production deployments:**
   - Update Render production service to use `main` branch
   - Update Vercel production project to use `main` branch
   - Update environment variables for production credentials

3. **Update Azure AD:**
   - Add production redirect URI
   - Remove v2 redirect URI after verification

4. **Update DNS:**
   - Point production domain to new Vercel deployment
   - Update CORS origins in backend

## 6. Troubleshooting

### Common Issues

**Backend Build Failures:**
- Ensure all dependencies are installed: `pnpm install`
- Check TypeScript compilation: `pnpm run typecheck`
- Verify build script works locally: `pnpm run build`

**Frontend Deployment Issues:**
- Verify Next.js configuration: `next.config.ts`
- Check API proxy configuration in rewrites
- Test locally with: `pnpm run dev`

**Authentication Problems:**
- Verify Azure AD redirect URIs match exactly
- Check NEXTAUTH_SECRET matches between environments
- Ensure NEXTAUTH_URL is correctly set

**API Connectivity Issues:**
- Verify CORS origins in backend
- Check API_URL environment variables
- Test API endpoints directly with curl

## 7. Support

For deployment assistance, contact:
- **Technical Support:** sprintwithcarlos@pm.me
- **Altius Officers:** (Internal contact list)

## 8. Change Log

- **2026-06-29:** Initial deployment guide created
- **2026-06-29:** Added rollback and promotion procedures
- **2026-06-29:** Updated environment variable documentation