## Why

The platform lacks a persistent notification system. Notifications are stored in memory (lost on restart), the email sending and notification recording are coupled in a dual-write anti-pattern, and there is no way for users to view their notifications in-app. Adding a proper notification infrastructure with optional Web Push support creates a communication backbone for future features (blog, LMS, onboarding, gamification alerts).

## What Changes

- **New `notifications` table** and repository (PG + in-memory) for persistent notification storage
- **Refactor `notificationService.ts`**: replace in-memory array with repository-backed service, fix dual-write bug where `sendEmail()` and callers both create notifications independently
- **Unify `emailSender.ts` and `emailTemplateService.ts`** into a single email sending pipeline with consistent template rendering
- **New REST endpoints**: `GET /api/notifications` (list user's notifications), `PUT /api/notifications/:id/read` (mark as read), `POST /api/notifications/read-all` (mark all as read)
- **Web Push API** with VAPID keys: `POST /api/push/subscribe` (register device), `POST /api/push/unsubscribe` (unregister), Service Worker for receiving push events
- **Bell icon + dropdown** in portal and admin headers showing unread count and recent notifications
- **Notification types** expanded to cover all existing events (candidacy, bookings, check-in, etc.) plus new ones for blog/LMS/onboarding

## Capabilities

### New Capabilities
- `notification-system`: Persistent notifications with in-app feed, read tracking, and Web Push delivery
- `web-push-notifications`: Browser push notification subscription and delivery via Service Worker + VAPID

### Modified Capabilities
- *(no existing specs change — the notification system was never spec'd, only implemented ad-hoc in services)*

## Impact

- **Backend**: new table `notifications` + `push_subscriptions` in PG schema; new repositories; refactored `notificationService.ts` and `emailSender.ts`; new WebSocket-adjacent push delivery module; new routes and controllers
- **Frontend**: bell/dropdown component in shared layout (portal + admin); notification feed page; Service Worker registration and push handling
- **Dependencies**: `web-push` npm package (server-side push), VAPID key generation, Service Worker API (browser native)
- **No breaking changes** to existing API contracts — the refactor keeps the same `sendEmail()` signature and `INotificationService` interface
