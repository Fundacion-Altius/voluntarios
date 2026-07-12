## Context

The post-login routing currently sends all users to `/admin/dashboard` regardless of role. The portal at `/portal/` exists with profile, activities, achievements, and ranking tabs but has no news feed or onboarding guidance. New volunteers complete the candidacy flow (apply → approve → set password → login) and are met with an empty admin dashboard.

## Goals / Non-Goals

**Goals:**
- Blog/news feed in the volunteer portal with admin CRUD
- Onboarding checklist for new volunteers with progress tracking
- Fix post-login routing: volunteers → `/portal`, staff/admin → `/admin/dashboard`
- Keep it simple: no rich text editor dependency, markdown or plain text is fine

**Non-Goals:**
- Comments or social features on blog posts (future change)
- Automated onboarding tasks (e.g., "complete this course from LMS") — tasks are manually marked complete
- Email notifications for new blog posts (will be handled by the notification system from Change 1)

## Decisions

1. **Blog posts as a simple CRUD**: No heavy CMS. Admin creates posts with title, excerpt, body (textarea, plain text or simple HTML), image URL, and category. The feed is reverse-chronological, paginated.

2. **Onboarding tasks are admin-configurable**: A seed set of tasks is created via migration (complete perfil, leer guía, primera actividad, etc.). Admin can add/edit/delete tasks. Each volunteer gets implicit progress tracking — completed tasks are stored, uncompleted tasks are implied.

3. **Routing fix in login flow**: The `login/page.tsx` already has role checks for status messages. After successful login, check `user_type` from the user profile: if `"volunteer"`, redirect to `/portal`; otherwise redirect to `/admin/dashboard`. The backend login response already returns user data including `user_type`.

4. **Onboarding widget on portal home**: The portal home page shows a progress card with the checklist. Each task has a check button. Progress bar at top shows X of Y complete.

## Risks / Trade-offs

- [Routing fix] Some existing "volunteer" users in the database have `user_type` set to default `"staff"` (the PG default). These users would still go to admin. Mitigation: add a data migration to set existing volunteers' `user_type` correctly, or check `role` as fallback.
