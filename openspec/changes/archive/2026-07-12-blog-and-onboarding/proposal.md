## Why

The volunteer portal currently has no content beyond activity bookings and gamification stats. Volunteers land in the admin area after login with no guidance, no news, and no sense of progression. Adding a simple blog/news system gives the foundation a channel to publish updates, events, and training opportunities. An onboarding checklist gives new volunteers clear first steps and a sense of progress, fixing the "now what?" problem after account activation.

## What Changes

- **New blog system**: staff/admin can create, edit, and publish news posts with categories (noticias, eventos, formacion). Posts appear as a chronological feed in the volunteer portal.
- **New onboarding system**: configurable task checklist shown to new volunteers. Each task can be marked complete. Tasks include things like "complete your profile", "read the volunteer guide", "book your first activity".
- **Post-login routing fix**: volunteers (`user_type === "volunteer"`) go to `/portal` instead of `/admin/dashboard` after login. Staff and admins continue to go to `/admin/dashboard`.

## Capabilities

### New Capabilities
- `blog-posts`: Blog/news CMS with categories, rich content, chronological feed in portal
- `volunteer-onboarding`: Onboarding checklist with configurable tasks and per-volunteer progress tracking

### Modified Capabilities
- *(no existing specs change — blog and onboarding are entirely new)*

## Impact

- **Backend**: two new PG tables (`blog_posts`, `blog_categories`) + two new PG tables (`onboarding_tasks`, `volunteer_onboarding_progress`); new repositories and services; new routes for blog CRUD and onboarding progress; routing logic update in login endpoint
- **Frontend**: admin blog editor page; portal news feed; onboarding checklist widget on portal home; routing change in login page and auth context
- **No new dependencies** — rich text can use a simple textarea with markdown or a lightweight editor
- **No breaking changes** to existing API contracts

Archived: 2026-07-12
