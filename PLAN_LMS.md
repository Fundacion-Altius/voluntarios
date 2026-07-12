# VOLUNTARIOS — Plan Estratégico de Funcionalidades

**Fecha:** 2026-07-10
**Contexto:** Sesión de exploración posterior al archivado de `voluntarios-core-features`

---

## Resumen de lo que YA existe (no tocar)

| Feature | Estado | Código |
|---|---|---|
| Formulario candidatura + flujo apply/approve/deny | ✅ Completo | `candidaturaService.ts` |
| Actividades (tipos, sesiones, booking, waitlist) | ✅ Completo | `activityService.ts` |
| Check-in/out (manual + QR) | ✅ Completo | `activityService.ts` |
| Gamificación (puntos, niveles, rachas, insignias, ranking, certificados) | ✅ Completo | `gamificationService.ts` |
| Portal voluntario (perfil, actividades, logros, ranking) | ✅ Completo | `voluntarios-front/src/app/portal/` |

## Bugs detectados (arreglar durante las fases)

1. **Routing post-login**: Todos los usuarios van a `/admin/dashboard`. Voluntarios deben ir a `/portal`. Staff/admin deben ir a `/admin`.
2. **Notificaciones dual-write**: `sendEmail()` crea notificación tipo `survey_invitation` + los servicios crean otra manualmente. Refactorizar.
3. **Notificaciones solo en memoria**: No hay tabla PG. Se pierden al reiniciar.

---

## Los 4 Cambios (en orden)

### Cambio 1: Notificaciones (base infraestructura)

**Backend:**
- Tabla PG: `notifications` (id, user_id, type, title, body, status, read_at, created_at)
- Repositorio: `INotificationRepository` → `PgNotificationRepository` + `InMemoryNotificationRepository`
- Refactor `notificationService.ts`: usar repositorio, no array en memoria
- Limpiar dual-write: `sendEmail()` ya no crea notificación, el llamador decide
- Unificar `emailSender.ts` y `emailTemplateService.ts` (misma plantilla)
- Endpoints: `GET /api/notifications` (auth), `PUT /api/notifications/:id/read`
- Web Push API (Service Worker + VAPID) para notificaciones push en navegador

**Frontend:**
- Componente campana en header (portal + admin)
- Feed de notificaciones (dropdown o página)
- Service Worker para push notifications
- Permiso de notificaciones al primer login

---

### Cambio 2: Blog + Onboarding + Routing fix

#### Blog/News

**Backend:**
- Tabla PG: `blog_posts` (id, title, slug, excerpt, content, image_url, category, published_at, author_id, created_at, updated_at)
- Tabla: `blog_categories` (id, name, slug)
- Repositorio: `IBlogPostRepository` (PG + in-memory)
- CRUD endpoints: `GET /api/blog` (público), `POST/PUT/DELETE /api/blog` (staff/admin)
- Al crear post → notificación push a voluntarios

**Frontend:**
- Admin: CRUD posts con rich text editor
- Portal: feed cronológico de noticias/eventos
- Categorías: noticias, eventos, formacion

#### Onboarding

**Backend:**
- Tabla PG: `onboarding_tasks` (id, title, description, order, is_required, icon)
- Tabla: `volunteer_onboarding_progress` (user_id, task_id, completed_at)
- Servicio: `onboardingService.ts` con `getProgress()`, `completeTask()`, `getNextStep()`
- Endpoints: `GET /api/onboarding/progress`, `PUT /api/onboarding/complete/:taskId`

**Frontend:**
- Checklist de onboarding en página de bienvenida post-registro
- Pasos típicos: completar perfil → leer guía → primera actividad → ...
- Barra de progreso global

#### Routing fix
- Login redirige según role + user_type:
  - `role === "admin"` → `/admin/dashboard`
  - `user_type === "staff"` → `/admin/dashboard`
  - `user_type === "volunteer"` → `/portal`

---

### Cambio 3: LMS (sin videollamada)

**Backend — Data Model:**
- `courses` (id, title, description, image_url, level, category, status, created_by, created_at)
- `modules` (id, course_id, title, description, order, created_at)
- `lessons` (id, module_id, title, content_type: text|video|quiz, content_url, duration_min, order)
- `enrollments` (id, user_id, course_id, status: enrolled|in_progress|completed, progress_pct, completed_at)
- `lesson_progress` (id, user_id, lesson_id, completed_at, score?)
- Repositorios para cada tabla (PG + in-memory)

**Backend — Servicios:**
- `courseService.ts`: CRUD cursos, módulos, lecciones
- `enrollmentService.ts`: matricular, progreso, completar
- `certificateService.ts`: generar certificado de curso (reusa PDF existente)

**Backend — Roles/Permisos:**
- `role === "admin"` o `user_type === "staff"` → crear/editar cursos
- `role === "general"` con `user_type === "volunteer"` → matricularse, consumir

**Frontend:**
- Admin: CRUD cursos con wizard de módulos/lecciones
- Portal: catálogo de cursos, vista de detalle, reproductor de lecciones
- Progreso por curso, certificado descargable
- Integración: completar curso → puntos en gamificación

---

### Cambio 4: Videoconferencia (mediasoup)

**Infraestructura:**
- Dependencias: `mediasoup` (backend), `mediasoup-client` (frontend), `ws` (WebSocket)
- Requisitos sistema: Node >=22, Python >=3.7, C++17, `build-essential`
- TURN server (`coturn`) para producción (NAT traversal)

**Arquitectura mediasoup:**

```
voluntarios-back/src/mediasoup/
├── index.ts                    # Inicialización workers
├── config.ts                   # Puertos RTC, codecs, workers
├── workerManager.ts            # Crear/distribuir workers (1 por CPU)
├── room/
│   ├── Room.ts                 # Router + peers + transports + producers/consumers
│   └── RoomManager.ts          # Map<roomId, Room> singleton
├── peer/
│   └── Peer.ts                 # WebSocket + transports + producers + consumers
├── transport/
│   └── transportFactory.ts     # Crear WebRtcTransports
└── signaling/
    ├── signalingServer.ts      # WebSocket server en mismo HTTP server
    ├── signalingHandler.ts     # Rutas de mensajes WS → handlers
    └── messages.ts             # Tipos de mensajes
```

**Modelo de datos:**
- `video_rooms` (id, session_id? course_id?, instructor_id, status, created_at) opcional
- O reusar `activity_sessions` existente (una clase en vivo = una sesión)

**Flujo 1-to-1 (tutoría):**
```
Voluntario solicita tutoría → Admin asigna instructor
→ Se crea sala privada
→ Ambos: sendTransport → Producer → Consumer del otro
```

**Flujo 1-to-many (clase):**
```
Instructor crea sesión → Voluntarios se apuntan (booking)
→ Llega la hora → Entran a sala
→ Instructor: sendTransport → Producer
→ Cada alumno: recvTransport → Consumer (no produce)
```

**Frontend:**
- Sala de video embebida en el portal (página `/portal/sala/:id`)
- Controles: micrófono, cámara, compartir pantalla, colgar
- Indicador de quién habla (ActiveSpeakerObserver)
- Vista de grid para el instructor (todos los alumnos)
- Vista de "escucha" para alumnos (solo instructor)
- 1-to-1: view dividida

---

## Web Push (aclaración)

**No requiere app nativa.** Funciona así:
1. El usuario visita la web y concede permiso
2. El navegador genera una suscripción (URL + clave pública)
3. Se guarda en backend (`push_subscriptions` table)
4. Cuando hay una notificación, backend envía POST a servicio push
5. El Service Worker del navegador recibe el evento y muestra notificación
6. Funciona incluso con el navegador cerrado

Para experiencia óptima en móvil: añadir manifest.json (PWA) para que el usuario pueda "instalar" la web en su home screen. Sigue sin pasar por app store.

---

## Conexiones entre módulos

```
Notificaciones ◄── Blog (nuevo post → push a todos)
Notificaciones ◄── LMS (clase en vivo en 1h → recordatorio)
Notificaciones ◄── Onboarding (siguiente paso pendiente)
Gamificación   ◄── LMS (completar curso → +puntos)
Onboarding     ◄── LMS (paso obligatorio: completar curso intro)
Activities     ◄── LMS (clase en vivo = sesión de actividad)
Certificados   ◄── LMS (certificado de curso, reusa PDFGenerator)
```

---

## Pendiente para definir

- [ ] Roles LMS: ¿crear rol `instructor` o usar `user_type === "staff"`?
- [ ] ¿Certificados de gamificación y de LMS son iguales o distintos?
- [ ] Web Push: ¿solo escritorio o también mobile (PWA installable)?
- [ ] ¿Grabación de videollamadas? (mediasoup lo permite con ffmpeg)
