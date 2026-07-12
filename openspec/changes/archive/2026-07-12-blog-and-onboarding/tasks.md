## 1. Post-Login Routing Fix

- [x] 1.1 Include `user_type` in login controller response and JWT payload
- [x] 1.2 Update auth middleware to fetch full user for local (HS256) tokens
- [x] 1.3 Include `user_type` in NextAuth session and JWT callbacks
- [x] 1.4 Fix login page redirect: volunteers → `/portal`, staff/admins → `/admin/dashboard`
- [x] 1.5 Fix Azure AD login callbackUrl to use `user_type`
- [x] 1.6 Update `useAuth` hook's `login()` method to support dynamic callbackUrl
- [x] 1.7 Add redirect logic to `AuthProvider` or login flow for Azure AD
- [x] 1.8 Add data migration to set existing volunteers' `user_type` correctly (only if field was defaulted to `"staff"`)

## 2. Blog Database Schema

- [x] 2.1 Create `blog_categories` Drizzle PG table schema (id, name, slug, description, created_at)
- [x] 2.2 Create `blog_posts` Drizzle PG table schema (id, title, slug, excerpt, body, image_url, category_id FK, author_id FK, published_at, created_at, updated_at)
- [x] 2.3 Create DB migration seed for default categories (`noticias`, `eventos`, `formacion`)
- [x] 2.4 Run `pnpm run db:pg:generate` to create migration SQL

## 3. Blog Backend

- [x] 3.1 Create `BlogPost` entity type
- [x] 3.2 Create `BlogCategory` entity type
- [x] 3.3 Create `IBlogPostRepository` interface
- [x] 3.4 Create `IBlogCategoryRepository` interface
- [x] 3.5 Implement `PgBlogPostRepository`
- [x] 3.6 Implement `InMemoryBlogPostRepository` (dev fallback)
- [x] 3.7 Implement `PgBlogCategoryRepository`
- [x] 3.8 Implement `InMemoryBlogCategoryRepository` (dev fallback)
- [x] 3.9 Register blog repositories in `repositoryFactory.ts`
- [x] 3.10 Create `blogPostController.ts` with CRUD handlers
- [x] 3.11 Create `blogCategoryController.ts` with CRUD handlers
- [x] 3.12 Create `blogRoutes.ts` and register in routes/index.ts

## 4. Onboarding Database Schema

- [x] 4.1 Create `onboarding_tasks` Drizzle PG table schema (id, title, description, display_order, is_active, created_at)
- [x] 4.2 Create `volunteer_onboarding_progress` Drizzle PG table schema (id, task_id FK, user_id FK, completed_at, created_at)
- [x] 4.3 Create DB migration seed for default onboarding tasks
- [x] 4.4 Run `pnpm run db:pg:generate` to create migration SQL

## 5. Onboarding Backend

- [x] 5.1 Create `OnboardingTask` entity type
- [x] 5.2 Create `VolunteerOnboardingProgress` entity type
- [x] 5.3 Create `IOnboardingTaskRepository` interface
- [x] 5.4 Create `IOnboardingProgressRepository` interface
- [x] 5.5 Implement `PgOnboardingTaskRepository`
- [x] 5.6 Implement `InMemoryOnboardingTaskRepository` (dev fallback)
- [x] 5.7 Implement `PgOnboardingProgressRepository`
- [x] 5.8 Implement `InMemoryOnboardingProgressRepository` (dev fallback)
- [x] 5.9 Register onboarding repositories in `repositoryFactory.ts`
- [x] 5.10 Create `onboardingTaskController.ts` (admin CRUD)
- [x] 5.11 Create `onboardingProgressController.ts` (volunteer progress)
- [x] 5.12 Create `onboardingRoutes.ts` and register in routes/index.ts

## 6. Frontend — Blog Feed in Portal

- [x] 6.1 Create `/portal/noticias/page.tsx` with paginated blog feed
- [x] 6.2 Create "Noticias" tab in portal layout navbar
- [x] 6.3 Create blog post card component for the feed list
- [x] 6.4 Create blog post detail view at `/portal/noticias/[slug]`
- [x] 6.5 Add "Noticias" section to portal home page showing latest 5 posts
- [x] 6.6 Add blog API calls to frontend API service or utility

## 7. Frontend — Admin Blog Editor

- [x] 7.1 Create admin blog posts list page at `/admin/blog`
- [x] 7.2 Create admin blog post editor (create/edit form)
- [x] 7.3 Add "Blog" link to admin sidebar navigation
- [x] 7.4 Admin can publish/unpublish posts

## 8. Frontend — Onboarding Checklist

- [x] 8.1 Create onboarding progress card component for portal home
- [x] 8.2 Create `/api/onboarding/my-progress` integration in frontend
- [x] 8.3 Implement mark-task-complete button with optimistic update
- [x] 8.4 Dismiss/hide card when all tasks complete
- [x] 8.5 Create admin onboarding tasks management page at `/admin/onboarding`
- [x] 8.6 Add "Onboarding" link to admin sidebar navigation

## 9. Testing

- [x] 9.1 Write unit tests for blog repositories (in-memory) — 14 tests
- [x] 9.2 Write unit tests for onboarding repositories (in-memory) — 12 tests
- [x] 9.3 Write controller tests for blog endpoints — 22 tests
- [x] 9.4 Write controller tests for onboarding endpoints — 10 tests
- [x] 9.5 Write tests for post-login routing logic — 2 tests (authMiddleware + authController)
- [x] 9.6 Run typecheck (backend): `pnpm run typecheck` — ✅
- [x] 9.7 Run lint (frontend): `pnpm run lint` — ✅ (only pre-existing warnings)
- [x] 9.8 Run full unit test suite: `pnpm test` — **294 passed, 47 files** ✅
- [x] 9.9 Write integration tests for `pgBlogCategoryRepository` — 6 tests ✅
- [x] 9.10 Write integration tests for `pgBlogPostRepository` — 7 tests ✅
- [x] 9.11 Write integration tests for `pgOnboardingTaskRepository` — 7 tests ✅
- [x] 9.12 Write integration tests for `pgOnboardingProgressRepository` — 5 tests ✅
- [x] 9.13 Run full integration test suite: `pnpm test:integration` — **55 passed, 10 files** ✅
