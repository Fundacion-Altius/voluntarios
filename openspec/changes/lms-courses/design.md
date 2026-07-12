## Context

The existing architecture provides the pattern: entities → repository interface → PG + in-memory implementations → factory → controller → route. The gamification system already awards points for check-in activities. The certificate system already generates PDFs via `gamificationService.getCertificate()`. The LMS will follow the same patterns without introducing new frameworks.

## Goals / Non-Goals

**Goals:**
- Course CRUD (admin/staff only) with modules and lessons
- Course catalog browsing (volunteers, authenticated)
- Self-enrollment with progress tracking (lesson-by-lesson)
- Course completion certificate (PDF)
- Gamification integration: +100 points on course completion
- Content types: text (HTML/markdown), embedded video URL, simple quiz (multiple choice stored as JSON)

**Non-Goals:**
- Native video upload or streaming (use YouTube/Vimeo embeds)
- Scheduled live classes (Cambio 4/Videoconferencia handles this)
- SCORM or LTI compatibility
- Course ratings or reviews
- Admin-assigned mandatory courses (auto-enroll)
- Prerequisite courses (chaining)

## Decisions

1. **Course content model**: Course → Module (ordered) → Lesson (ordered). A lesson has a `content_type` enum: `"text"`, `"video"`, `"quiz"`. For `"text"`, `content` stores HTML. For `"video"`, `content_url` stores the embed URL. For `"quiz"`, `content` stores a JSON array of `{ question, options: string[], correctIndex: number }`.

2. **Enrollment is self-serve**: Volunteers browse the catalog and click "Enroll". No approval needed. Admin can also enroll users via an admin endpoint.

3. **Progress is lesson-based**: Completing a lesson = marking it done. Percent progress = completed lessons / total lessons in course × 100. No time tracking or mandatory ordering (volunteers can skip around).

4. **Certificate reuses existing PDF generator**: The `getCertificate` function in `gamificationService` generates a PDF for gamification. Course certificates will be a separate endpoint that generates a similar-style PDF with course title, volunteer name, and completion date.

5. **Points integration**: On course completion (all lessons done), the enrollment service calls `calculateAndAwardPoints` with a special `"course_completion"` source for 100 bonus points. This reuses the existing points → streak → level → badge cascade.

## Risks / Trade-offs

- [Quiz] Storing quiz data as JSON in a text column means no querying on individual questions. Acceptable for this scale.
- [Progress] Lesson-based progress is coarse — a lesson with 1 paragraph counts the same as a lesson with 10 pages. Acceptable for v1.
- [Certificates] May want to differentiate visually from gamification certificates. For now, same template with different title.
