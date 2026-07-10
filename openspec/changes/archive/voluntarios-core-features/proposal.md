## Why

The platform needs to evolve from an admin-only contract/survey tool into a full volunteer management system. Currently there is no volunteer lifecycle: people apply externally with no digital record, there's no activity scheduling, and no engagement loop. Adding candidacy management, activity booking with check-in/out, and gamification will make the platform the central hub for the foundation's volunteer operations.

## What Changes

- **User model expands**: add `status` field (`candidate | active | inactive | on-reserve`) and allow `password_hash` to be nullable for candidates who haven't set credentials yet
- **New candidacy flow**: public application form + admin Excel bulk upload + admin review dashboard (accept / put on reserve) + automatic email notifications at each stage + `user_status_log` audit table
- **New activity system**: admin creates activity types (with optional recurrence config), the system materialises individual sessions, volunteers book sessions with capacity/waitlist, admin checks volunteers in/out via dashboard or QR code
- **New gamification system**: points earned per hour of activity, streaks for consecutive weekly participation, levels (bronze/silver/gold/diamond) with permissions (silver unlocks feed publishing), weekly top-3 ranking published every Monday, badges, downloadable certificates
- **New volunteer portal**: authenticated area where volunteers see their profile, upcoming bookings, points, level, badges, certificates, and the weekly ranking
- **Existing specs to modify**: `user-auth` and `user-management` (new status field), `user-role-management` (status lifecycle)
- **No breaking changes** to existing contract or survey flows

## Capabilities

### New Capabilities
- `candidacy-management`: volunteer application lifecycle (public form, Excel upload, status state machine, admin review, email notifications)
- `activity-management`: activity types, session scheduling, booking with waitlist, check-in/out with QR
- `gamification`: points, streaks, levels, weekly ranking, badges, certificates, share to social media
- `volunteer-portal`: authenticated area for volunteers — profile, bookings, progress, achievements

### Modified Capabilities
- `user-auth`: user records can now have `password_hash = null` (candidates), login only after status is `active`
- `user-management`: new `status` field and `user_type` field (`staff | volunteer | beneficiary`, default `staff`), nullable `password_hash`
- `user-role-management`: status lifecycle (candidate → active → inactive / on-reserve) with audit log

## Impact

- **Backend**: new routes for candidacy, activities, gamification; new tables (activity_types, activity_sessions, bookings, check_ins, waitlist, points, streaks, levels, badges, rankings, certificates, user_status_log); User entity gains status field; notification service must support candidacy emails
- **Frontend**: new public page `/hazte-voluntario`; new admin sections (Candidatos, Actividades, Ranking); new volunteer portal section (profile, bookings, achievements); existing dashboard may show new KPIs
- **Infrastructure**: no new services — standard Express + Postgres (or in-memory for dev); QR codes can be generated server-side with no external dependency
- **Dependencies**: email templates for candidacy notifications; QR code generation library (e.g., `qrcode` npm package)

Archived: 2026-07-10
