## 1. Database Schema

- [x] 1.1 Create `notifications` Drizzle PG table schema (id, user_id, type, title, body, status, read_at, created_at, metadata)
- [x] 1.2 Create `push_subscriptions` Drizzle PG table schema (id, user_id, endpoint, auth_key, p256dh_key, user_agent, created_at)
- [ ] 1.3 Run `pnpm run db:pg:generate` to create migration SQL (needs local PG running)
- [x] 1.4 Create `INotificationRepository` interface with create, getAll, getByUser, getUnreadByUser, markRead, markAllRead
- [x] 1.5 Create `IPushSubscriptionRepository` interface with subscribe, unsubscribe, getByUser
- [x] 1.6 Implement `PgNotificationRepository` using Drizzle + postgres.js
- [x] 1.7 Implement `InMemoryNotificationRepository` (dev fallback)
- [x] 1.8 Implement `PgPushSubscriptionRepository` using Drizzle + postgres.js
- [x] 1.9 Implement `InMemoryPushSubscriptionRepository` (dev fallback)
- [x] 1.10 Register both repositories in `repositoryFactory.ts`

## 2. Email Pipeline Unification

- [x] 2.1 Refactor `emailSender.ts`: remove auto-creation of notifications inside `sendEmail()`
- [x] 2.2 Unify template rendering: remove `emailTemplateService.ts`, consolidate logic into `emailSender.ts`
- [x] 2.3 Update `surveyEmailWorker.ts` to use the unified `emailSender.ts`
- [x] 2.4 Update `candidaturaService.ts`: create notifications explicitly after `sendEmail()` calls
- [x] 2.5 Update `activityService.ts`: create notifications explicitly after `sendEmail()` calls
- [x] 2.6 Update `candidateController.ts`: create notifications explicitly for bulk_import

## 3. Notification API

- [x] 3.1 Create `GET /api/notifications` with filter and pagination
- [x] 3.2 Create `PUT /api/notifications/:id/read` to mark single notification as read
- [x] 3.3 Create `POST /api/notifications/read-all` to mark all as read
- [x] 3.4 Create `notificationController.ts` with handlers for all endpoints
- [x] 3.5 Create `notificationRoutes.ts` and register in routes/index.ts

## 4. Web Push Infrastructure

- [x] 4.1 Add `web-push` npm dependency to backend
- [x] 4.2 Create VAPID key generation script
- [x] 4.3 Create `POST /api/push/subscribe` endpoint
- [x] 4.4 Create `POST /api/push/unsubscribe` endpoint
- [x] 4.5 Create `pushController.ts` and `pushRoutes.ts`
- [x] 4.6 Wire notification creation to trigger push delivery via `web-push`
- [x] 4.7 Handle expired subscriptions (410 Gone) with cleanup

## 5. Frontend — Notification Bell & Feed

- [x] 5.1 Create `NotificationBell` React component with unread badge and dropdown
- [x] 5.2 Create `NotificationFeed` page at `/portal/notificaciones` (full history)
- [x] 5.3 Add notification polling (30s interval) to the bell component
- [x] 5.4 Add bell component to portal layout header
- [x] 5.5 Add bell component to admin layout header (via TopBar)
- [x] 5.6 Implement mark-as-read on notification click

## 6. Frontend — Web Push (Service Worker)

- [x] 6.1 Create Service Worker file (`sw.js`) with `push` event listener
- [x] 6.2 Register Service Worker in the app layout
- [x] 6.3 Implement push subscription on user grant (request permission, subscribe, POST to backend)
- [x] 6.4 Implement push unsubscription on revoke
- [x] 6.5 Handle notification click event (open/focus app at correct URL)
- [x] 6.6 Add PWA manifest.json for installable web app (optional, mobile-friendly)

## 7. Testing

- [x] 7.1 Write unit tests for `InMemoryNotificationRepository` (tests ported and passing)
- [x] 7.2 Write unit tests for notification service (create, list, mark read)
- [x] 7.3 Write unit tests for push subscription service
- [x] 7.4 Write controller tests with supertest for notification endpoints
- [x] 7.5 Write controller tests with supertest for push endpoints
- [x] 7.6 Run typecheck: `pnpm run typecheck` ✅
- [x] 7.7 Run lint: `pnpm run lint` ✅
- [x] 7.8 Run full test suite: `pnpm test` ✅ (221/221 passing)
