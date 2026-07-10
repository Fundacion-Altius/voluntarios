## 1. Data Model — User & Schema Changes

- [x] 1.1 Add `status` field to User entity (`'candidate' | 'active' | 'inactive' | 'on-reserve'`), `user_type` field (`'staff' | 'volunteer'`), and make `password_hash` nullable in both in-memory and PG schema
- [x] 1.2 Create `user_status_log` table schema (in-memory interface + Drizzle PG table)
- [x] 1.3 Create `IUserStatusLogRepository` interface and implementations (in-memory + PG)
- [x] 1.4 Create `activity_types` table schema
- [x] 1.5 Create `activity_sessions` table schema
- [x] 1.6 Create `bookings` table schema with foreign keys to user and session
- [x] 1.7 Create `waitlist` table schema
- [x] 1.8 Create `check_ins` table schema
- [x] 1.9 Create `points` table schema
- [x] 1.10 Create `streaks` table schema
- [x] 1.11 Create `levels` table schema
- [x] 1.12 Create `badges` table schema
- [x] 1.13 Create `rankings` table schema
- [x] 1.14 Create `certificates` table schema
- [x] 1.15 Create all repository interfaces and implementations for new tables (in-memory + PG)
- [x] 1.16 Register new repositories in `repositoryFactory.ts`
- [x] 1.17 Generate Drizzle PG migration with `pnpm run db:pg:generate`

## 2. Candidacy — Service Layer & Business Logic

- [x] 2.1 Create `src/modules/candidacy/candidaturaService.ts` with `aplicar()`, `aprobar()`, `ponerEnReserva()`, `desactivar()` functions encapsulating status transitions
- [x] 2.2 Implement `aplicar()`: create User as candidate, send confirmation email, log to user_status_log, handle duplicate email (on-reserve detection)
- [x] 2.3 Implement `aprobar()`: transition candidate→active, send acceptance email with token link, log status change
- [x] 2.4 Implement `ponerEnReserva()`: transition candidate→on-reserve, send notification email, log
- [x] 2.5 Implement `desactivar()`: transition active→inactive, cancel future bookings, log
- [x] 2.6 Implement password token generation and validation for acceptance flow
- [x] 2.7 Add email templates: `candidatura-recibida.html`, `candidatura-aprobada.html`, `candidatura-reserva.html`

## 3. Candidacy — API Routes & Controllers

- [x] 3.1 Create `POST /api/candidates/apply` (public) — receives form data, calls `aplicar()`
- [x] 3.2 Create `POST /api/candidates/bulk-import` (admin only) — accepts Excel file upload, parses rows, calls `aplicar()` in batch
- [x] 3.3 Create `GET /api/candidates` (admin only) — list candidates with filters (status, date range)
- [x] 3.4 Create `PUT /api/candidates/:id/approve` (admin only) — calls `aprobar()`
- [x] 3.5 Create `PUT /api/candidates/:id/reserve` (admin only) — calls `ponerEnReserva()`
- [x] 3.6 Create `PUT /api/users/:id/deactivate` (admin only) — calls `desactivar()`
- [x] 3.7 Create `POST /api/auth/set-password` (public, token-gated) — allows candidate to set password after acceptance

## 4. Candidacy — Frontend

- [x] 4.1 Create public page `/hazte-voluntario` with the application form (name, email, phone, residence, birth date, availability, interests, free text)
- [x] 4.2 Add client-side validation to the form
- [x] 4.3 Create admin page `/admin/candidatos` with candidate list, status badges, approve/reserve buttons
- [x] 4.4 Create Excel upload component in admin candidates page
- [x] 4.5 Create password setup page `/crear-password` with token validation
- [x] 4.6 Add status-aware login: candidates see "still reviewing", inactive see "contact foundation"

## 5. Activities — Service Layer & Business Logic

- [x] 5.1 Create `src/modules/activities/activityService.ts` with activity type CRUD, session materialisation, booking, check-in/out
- [x] 5.2 Implement activity type CRUD (create with recurrence, edit, list, delete)
- [x] 5.3 Implement session materialisation: for recurring types, generate sessions for current + next week; for one-off, single session
- [x] 5.4 Implement session management: admin override capacity, cancel session, create ad-hoc
- [x] 5.5 Implement booking: volunteer books session, enforce max 3 future bookings, decrement capacity
- [x] 5.6 Implement waitlist: FIFO queue, notify next person when slot opens
- [x] 5.7 Implement cancellation: regular (24h+ before) vs late (<24h), no-show tracking, 7-day penalty after 2 consecutive no-shows
- [x] 5.8 Implement check-in/out: manual (admin tick) and QR-based, calculate duration, trigger point calculation

## 6. Activities — API Routes & Controllers

- [x] 6.1 Create CRUD routes for activity types (admin only)
- [x] 6.2 Create routes for session management (admin: list, override capacity, cancel, create ad-hoc)
- [x] 6.3 Create `GET /api/sessions/upcoming` (volunteer) — list bookable upcoming sessions
- [x] 6.4 Create `POST /api/sessions/:id/book` (volunteer) — book a session
- [x] 6.5 Create `POST /api/sessions/:id/book/waitlist` (volunteer) — join waitlist
- [x] 6.6 Create `POST /api/bookings/:id/cancel` (volunteer) — cancel booking
- [x] 6.7 Create `GET /api/sessions/:id/attendance` (admin) — list bookings with check-in status
- [x] 6.8 Create `POST /api/sessions/:id/check-in` (admin) — manual check-in
- [x] 6.9 Create `POST /api/sessions/:id/check-out` (admin) — manual check-out
- [x] 6.10 Create `POST /api/sessions/scan-qr` (admin) — QR scan endpoint

## 7. Activities — Frontend

- [x] 7.1 Create admin page `/admin/actividades` with activity types CRUD
- [x] 7.2 Create admin session manager: calendar view of sessions, capacity override, cancel, ad-hoc creation
- [x] 7.3 Create admin attendance view: session attendee list with check-in/out buttons
- [x] 7.4 Create admin QR scanner page with camera access
- [x] 7.5 Create volunteer booking view: list of upcoming sessions, book button, waitlist option
- [x] 7.6 Create QR generation in volunteer's booking detail page

## 8. Gamification — Service Layer & Business Logic

- [x] 8.1 Create `src/modules/gamification/gamificationService.ts` with point calculation, streaks, levels, badges, ranking, certificates
- [x] 8.2 Implement point calculation on check-out: base 10pts/h + bonuses (Saturday +2, logistics +3), minimum 30 min threshold
- [x] 8.3 Implement streak tracking: consecutive weeks with at least one check-in, reset on missed week
- [x] 8.4 Implement streak bonus awards at 2 weeks (+50), 4 weeks (+150), 8 weeks (+500 + "Fiel" badge)
- [x] 8.5 Implement level calculation: total accumulated points → bronze (0-499), silver (500-1499), gold (1500-2999), diamond (3000+)
- [x] 8.6 Implement badge conditions and award logic
- [x] 8.7 Implement weekly ranking calculation (Mon–Sun window), publish every Monday 8:00 AM
- [x] 8.8 Implement certificate PDF generation with volunteer name, hours, level, verification QR code
- [x] 8.9 Implement shareable image card generation for social media
- [x] 8.10 Wire gamification triggers: point calculation called from check-out, streaks checked on weekly cron, levels checked on point award

## 9. Gamification — API Routes & Controllers

- [x] 9.1 Create `GET /api/gamification/profile` (volunteer) — returns level, points, streaks, badges
- [x] 9.2 Create `GET /api/gamification/ranking` (volunteer) — returns current weekly top 3 + user's position
- [x] 9.3 Create `GET /api/gamification/badges` (volunteer) — list earned badges
- [x] 9.4 Create `POST /api/gamification/certificate` (volunteer) — generates and returns PDF
- [x] 9.5 Create `POST /api/gamification/share-card` (volunteer) — generates shareable image
- [x] 9.6 Create `GET /api/gamification/ranking/admin` (admin) — full ranking history

## 10. Gamification — Frontend

- [x] 10.1 Create volunteer profile section showing level, points, streak, badges
- [x] 10.2 Create ranking view in volunteer portal (top 3 + my position)
- [x] 10.3 Create badge gallery component
- [x] 10.4 Create certificate generation button + download
- [x] 10.5 Create share card generation with download/social preview
- [x] 10.6 Create admin ranking overview with weekly history

## 11. Volunteer Portal — Frontend

- [x] 11.1 Create volunteer portal layout under `/portal/` (profile, bookings, ranking, badges)
- [x] 11.2 Create navigation and auth guard for portal routes
- [x] 11.3 Create upcoming bookings widget with cancel action
- [x] 11.4 Create activity history view with duration and points per session

## 12. Infrastructure & Cross-Cutting

- [x] 12.1 Add `qrcode` npm dependency to backend
- [x] 12.2 Create weekly ranking cron job (Bull queue for staging/prod, setInterval for dev)
- [x] 12.3 Add email templates directory entries for new notification types
- [x] 12.4 Wire notification service to candidacy and activity events
- [x] 12.5 Add rate limiting middleware for public endpoints (`POST /api/candidates/apply`)
- [x] 12.6 Update existing seed data to include status field on dev users
- [x] 12.7 Add typecheck and lint: `pnpm run typecheck && pnpm run lint`
