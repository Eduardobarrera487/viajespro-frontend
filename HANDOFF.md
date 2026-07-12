# HANDOFF — ViajesPro Frontend

Estado del proyecto para retomar en el siguiente contexto. Frontend en **Next.js 16 (App Router,
JavaScript puro), React 19, Tailwind v4, Zod 4**, que consume una **API .NET** (`AppReservasAPI`).

---

## 1. Cómo correr

```bash
npm install
# .env.local (ya configurado a local):
#   API_BASE_URL=http://localhost:5098
#   API_KEY=rvapi_9F7kLm42QpXz8TnB6wHy3DaV1sRe0cMu
npm run dev            # http://localhost:3000
```
- La API .NET debe estar corriendo (`dotnet run` → `:5098`). Backend actualizado en
  `D:\Descargas\API Viajes PRO\ReservasViajesAPI.NET-main\AppReservasAPI`.
- **Tras cambiar `.env.local`, reinicia `npm run dev`** (Next lee env solo al arrancar).
- La API key ya coincide con la del backend local. La BD real está en **somee** (remota) —
  si va lenta/caída, verás 500 (no es el front).

---

## 2. Arquitectura (lo esencial)

- **`src/lib/api/client.js`** (`server-only`): `apiFetch()` inyecta `X-API-KEY` (secreta, solo servidor)
  y el JWT Bearer. **Ningún Client Component** importa módulos `server-only`; el único puente
  cliente→servidor son las **Server Actions**.
- **Sesión** (`src/lib/auth/session.js`): cookie **`vp_session`** httpOnly con `{ token, usuario }`.
- **Middleware** (`src/middleware.js`): toda la app es privada salvo `/auth*`. Sin cookie → `/auth?next=`.
  Protege `/admin` y `/vendedor/admin` por rol. `/logout` (route handler) borra cookie inválida
  (rompe el bucle de 401 cuando el JWT del backend cambió).
- **Casing mixto**: el backend a veces responde camelCase y a veces PascalCase → el código lee
  tolerante (`x.campo ?? x.Campo`). Mantener ese patrón al tocar mapeos.
- **URLs de archivos relativas**: el backend devuelve imágenes/documentos como `/uploads/...`
  (relativas). El frontend las vuelve **absolutas** con `API_BASE_URL` en la capa de datos
  (`getViaje`/`getViajes` para imágenes, `getCertificaciones` para documentos). El detalle es un
  **stub del backend** (`ToAbsoluteImageUrl` devuelve la ruta tal cual).

---

## 3. Mapa de rutas y features

| Ruta | Qué hace |
|---|---|
| `/` | Exploración con filtros (`DestinosExplorer`) — imágenes reales |
| `/auth`, `/auth/forgot-password`, `/logout` | Login/registro/recuperar/logout |
| `/viajes/[id]` | Detalle: galería (imagen real), `TripInclusions` (acordeón), `BookingCard` |
| `/viajes/[id]/reservar` (+ `/confirmacion`) | Checkout → **POST /api/Reservas** real → confirmación |
| `/reservas` | Historial (tabs), banner de reserva pausada (reagendar/reembolso) |
| `/vendedor/certificacion` | Solicitar certificación + ver estado (con motivo de rechazo) |
| `/vendedor/publicar` | **Gate**: bloquea si no está certificado. Form con inclusiones/itinerario |
| `/vendedor/mis-viajes` | Sus viajes: **Pausar** (con motivo) / **Reprogramar y publicar** (nueva fecha) |
| `/admin/*` | usuarios, roles, viajes, reservas, **certificaciones**, **reembolsos**, quejas |
| `/perfil`, `/likes`, `/quejas` | Features de compañeros |

---

## 4. Los 3 puntos del feedback del profesor — IMPLEMENTADOS y alineados con el backend real

Ver contrato completo en `docs/plan-feedback-profesor.md`.

1. **Agente certificado**: `/api/Agentes/*`. Publicar devuelve **403 `AGENTE_NO_CERTIFICADO`** si no
   está aprobado. Solicitud con documentos (obligatorios); admin aprueba/rechaza (con motivo).
2. **¿Qué incluye? + itinerario**: `GET /api/Viajes/{id}` devuelve `inclusiones[]` e `itinerario[]`.
   El detalle los muestra en **acordeón desplegable**. El publish los manda como `InclusionesJson`/
   `ItinerarioJson`. (No hay hotel como campo: el hotel es una inclusión de tipo "Hotel".)
3. **Reserva pausada → reagendar/reembolso**: al pausar el viaje (con motivo) sus reservas pasan a
   estado **"Pausada"** + notificación. Cliente: `POST /api/Reservas/{id}/{reagendar,reembolso}`.
   Admin resuelve reembolsos en `/admin/reembolsos` (Aprobar/Rechazar/Procesar). El agente puede
   **reprogramar** (fecha nueva) desde "Mis viajes".

---

## 5. Gotchas / notas para el que siga

- **`[FromBody]` exige `Content-Type: application/json`**: al llamar endpoints POST/PUT con DTO,
  siempre mandar un body (aunque sea `{}`), si no → **415**. (Ya pasó con el reembolso.)
- **No se puede editar una disponibilidad de un viaje inactivo** (backend). Por eso "reprogramar"
  primero reactiva y luego cambia la fecha.
- **Imágenes/documentos = proxy** (`/api/imagen?path=/uploads/...`, `src/lib/img.js` + `src/app/api/imagen/route.js`):
  como somee es **HTTP-only** y Vercel es HTTPS, `<img src="http://...">` se bloquearía por mixed content.
  Por eso las URLs de imágenes/documentos (`getViaje/getViajes`, `getMisPublicaciones/getPublicacionesAdmin`,
  `getCertificaciones`) se reescriben al proxy, que las trae server-side (HTTP ok) y las sirve por HTTPS.
  El middleware deja pasar `/api/imagen` sin sesión.
- **Uploads = filesystem del servidor**: una imagen subida en local **no está** en somee (y viceversa);
  la BD es compartida pero los archivos no. somee free puede no persistir uploads entre reinicios.
  Fix de fondo (backend): almacenamiento en la nube (Cloudinary/S3) en vez del filesystem.
- **Viaje sin imagen**: las tarjetas de **exploración** (`ViajeCard`) usan una imagen aleatoria
  **estable** (picsum sembrado por `viajeId`) solo si el viaje no tiene `imagenUrl`. El **detalle**
  (`Gallery`) y el checkout usan un placeholder neutro (✈) cuando no hay imagen.
- **Vercel**: las env NO salen de `.env.local` (gitignored) → configurarlas en el dashboard de Vercel.
- **`?preview=` flags** siguen en el código (demo sin backend): `/reservas?preview=pausada`,
  `/admin/certificaciones?preview=1`, `/vendedor/certificacion?preview=...`,
  `/vendedor/publicar?preview=nocert|cert`. Ya no se necesitan con el backend real; se pueden quitar.
- **`MobileNav`** es código muerto (no se renderiza). La consistencia móvil se logró vía el
  menú del avatar (`UserMenu`).
- **Impuestos**: se eliminó el 7% inventado; el total del front = precio × viajeros = total real de la BD.

---

## 6. Pendientes / posibles siguientes pasos

- **Campana de notificaciones**: el backend ya tiene el modelo `Notificacion` y las crea (pausa,
  reembolso, etc.), pero **no hay UI** de campana en el front. (Se dejó pendiente a propósito.)
- Quitar los `?preview` de demo.
- Multi-fecha por viaje: **descartado** — se decidió dejar **una sola fecha** por viaje.
- Confirmación de reserva usa placeholder de imagen (el `GET /api/Reservas/{id}` no trae la imagen).
- Sugerencias de backend (opcionales): completar `ToAbsoluteImageUrl`; scopear `GET /api/Reservas`
  y `PUT /api/Disponibilidades` por dueño; caché de `estadoCertificacion` (se llama por página en el header).

---

## 7. Memoria y docs
- Memoria del proyecto: `~/.claude/.../memory/` (`dotnet-api-context.md`, `viaje-detalle-page.md`).
- `docs/plan-feedback-profesor.md` — contrato y plan de los 3 puntos.
- `docs/api-context.md` — contrato general del API.
- `docs/cambios-sesion.md` — bitácora de esta sesión.
