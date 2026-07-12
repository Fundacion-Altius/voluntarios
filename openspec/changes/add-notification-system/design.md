## Context

The current notification system is an in-memory array in `notificationService.ts` with no persistence. `sendEmail()` in `emailSender.ts` creates a `survey_invitation` notification on every send, while callers (e.g., `candidaturaService.ts`) also create their own notification, producing duplicate records. The email template rendering is split across two files (`emailSender.ts` uses generic `{{key}}` regex, `emailTemplateService.ts` uses hardcoded `{{name}}`/`{{surveyLink}}` only), causing template breakage.

## Goals / Non-Goals

**Goals:**
- Persistent notification storage (PG table) with in-memory fallback for dev
- Unified email sending pipeline (one code path for all emails)
- Fix dual-write bug: notifications created once, by the caller, not by `sendEmail()`
- REST API for in-app notification feed (list, mark read, mark all read)
- Web Push notification delivery (VAPID + Service Worker)
- Bell/dropdown UI in both portal and admin headers

**Non-Goals:**
- Real-time WebSocket notifications (polling or push-only for now)
- Email templates redesign (keep existing HTML templates, just unify rendering)
- Notification preferences per user (future change)
- Push notification to mobile devices without browser (native app) — Web Push covers browser on desktop + mobile

## Decisions

1. **Repository pattern for notifications**: New `INotificationRepository` with `PgNotificationRepository` (staging/prod) and `InMemoryNotificationRepository` (dev), registered in `repositoryFactory.ts`. Follows the exact same pattern as existing repositories.

2. **Unified email pipeline**: Merge `emailSender.ts` and `emailTemplateService.ts`. The unified `emailSender.ts` uses the generic `{{key}}` regex replacement (which works for all templates), eliminating the hardcoded subset in `emailTemplateService.ts`. The `surveyEmailWorker.ts` is updated to use the unified sender.

3. **Notification creation ownership**: `sendEmail()` no longer creates a notification. Each caller (candidatura service, activity service, etc.) creates notifications explicitly. This fixes the dual-write bug.

4. **Web Push via `web-push` npm package**: Server-side uses `web-push` library with VAPID keys. Client-side uses browser Push API + Service Worker. Subscriptions stored in `push_subscriptions` table.

5. **Polling for in-app feed**: The bell component polls `GET /api/notifications?unread=true` every 30 seconds. No WebSocket needed for this phase — keeps complexity low.

## Risks / Trade-offs

- [Migration] Existing in-memory notifications from running sessions are lost. Acceptable — they were transient by nature.
- [Dual-write cleanup] `emailSender.ts` is imported by `candidaturaService.ts`, `activityService.ts`, and `surveyEmailWorker.ts`. Each caller must be updated to create its own notification. Risk of missing a caller → silent notification drop. Mitigation: exhaustive grep of all `sendEmail()` calls before refactoring.
- [Web Push] If VAPID keys are not configured in `.env`, push endpoints return 500. Mitigation: graceful fallback — push is optional, in-app notifications always work.
- [Polling] 30s polling is lightweight but not instant. Acceptable for a volunteer management app (not a chat system).
