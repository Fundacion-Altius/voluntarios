## Context

The platform currently handles contract signing, surveys, and an admin dashboard. Users are staff-only (admin/nave/general roles) authenticated via Microsoft Entra ID. There is no volunteer lifecycle, no activity scheduling, and no engagement system.

This change adds three interconnected domains: candidacy management, activity booking with check-in/out, and gamification. They are designed as functional modules within the existing modulith (Express + TypeScript), following the existing patterns (repositories, in-memory for dev, Postgres for staging/prod).

## Goals / Non-Goals

**Goals:**
- Allow external volunteers to apply and be onboarded through a public form or Excel bulk upload
- Provide admin tools to review, accept, or put candidates on reserve
- Let volunteers book activity sessions, check in/out, and track attendance
- Reward participation with points, streaks, levels, badges, and a weekly ranking
- Generate downloadable certificates and shareable achievement cards
- Add an authenticated volunteer portal for profile, bookings, and progress

**Non-Goals:**
- LMS / online training (separate change)
- Video conferencing (separate project)
- News/feed system (separate change)
- SMS/WhatsApp notifications (future enhancement, email-only for now)
- Beneficiary or employee user types (future change)

## Decisions

### 1. User status as a field, not a separate aggregate
**Decision:** Add `status: 'candidate' | 'active' | 'inactive' | 'on-reserve'` to the existing User entity, plus a `user_status_log` audit table.
**Rationale:** The user proposed this directly. A separate CandidacyApplication aggregate would be overengineering for what is essentially a state machine on User. The audit log provides history without the complexity of a full aggregate root.
**Alternatives considered:** Separate Candidacy aggregate (rejected: too much ceremony for a simple state machine).

### 2. Candidacy logic lives in a dedicated service module
**Decision:** Create `src/modules/candidacy/candidaturaService.ts` as the sole module that transitions User status. Controllers call this service instead of touching `userRepo.update()` directly.
**Rationale:** Encapsulates business rules (e.g., "can't accept a user who is already active", "must send email on status change") in one place. Follows the existing functional pattern (no classes).
**Alternatives considered:** Putting logic in controllers (rejected: logic duplication risk), using middleware (rejected: too implicit).

### 3. Activity types + materialised sessions pattern
**Decision:** Admin creates an `activity_type` with recurrence config (days of week, shifts). A background job or on-demand generation materialises concrete `activity_session` rows with dates. Recurring types generate sessions weekly; one-off types generate a single session on creation.
**Rationale:** Materialised sessions are simple to query, book, and check into. No complex temporal querying. Each session has its own capacity and can be independently cancelled/modified by admin.
**Alternatives considered:** Computed sessions via calendar queries (rejected: hard to handle cancellations and per-session overrides).

### 4. QR check-in as optional enhancement to manual check-in
**Decision:** Both manual (admin ticks a list) and QR-based check-in/out coexist. For QR: each booking gets a unique token; volunteer shows it on their phone, admin scans it with a simple scanner view. QR encodes `{ session_id, booking_token }`.
**Rationale:** Not all volunteers will have phones or apps. Manual fallback is essential. QR is a convenience layer, not a requirement for check-in to work.
**Alternatives considered:** NFC tags (rejected: hardware dependency), GPS check-in (rejected: unreliable indoors).

### 5. Points calculated from check-out time (actual hours)
**Decision:** Points = floor(actual_minutes / 60) × 10 + bonuses. No estimated or scheduled duration — only checked-in minutes count.
**Rationale:** Rewards actual presence, not intention. Prevents gaming the system. Admins see real attendance data.
**Alternatives considered:** Points per session (rejected: doesn't differentiate short vs long participation).

### 6. Weekly ranking with its own points window
**Decision:** The ranking is a separate Monday–Sunday window that resets weekly. Total accumulated points (for levels) run independently. The ranking publishes automatically on Monday at 8:00 AM via a cron job (Bull queue in staging/prod, `setInterval` in dev).
**Rationale:** Weekly freshness keeps motivation high without resetting people's hard-earned progress toward levels.
**Alternatives considered:** Single all-time ranking (rejected: stale, discouraging for new volunteers).

### 7. No external dependencies for QR or certificates
**Decision:** Use `qrcode` npm package for QR generation (server-side PNG generation). Certificates use the existing PDF generation infrastructure (PDFKit, already in the project).
**Rationale:** Minimises operational complexity. Both libraries are well-maintained and already compatible with the stack.
**Alternatives considered:** Third-party QR API (rejected: latency + dependency), Canva API for certificates (rejected: auth overhead).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Candidate data from public form could be spam | Add Google reCAPTCHA v3 to `/hazte-voluntario`; rate-limit by IP |
| Waitlist management gets complex with many no-shows | Simple FIFO waitlist, one notification at a time when a slot opens |
| Gamification could create perverse incentives (people checking in and leaving) | Points calculated on check-out duration; minimum 30 min threshold to count |
| Weekly ranking could discourage people who can't participate every week | Levels (accumulated) provide the long-term sense of progress; ranking is just a bonus |
| Many new tables increase schema complexity | All new tables follow existing Drizzle patterns; namespaced with clear foreign keys |
