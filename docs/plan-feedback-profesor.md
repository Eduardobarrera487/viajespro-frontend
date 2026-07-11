# Plan — Feedback del profesor

Roadmap de los 3 requerimientos. **Ninguno se puede resolver solo en frontend**: cada
uno necesita cambios en el API .NET (tablas/campos/endpoints). Aquí se define el
**contrato de API** que debe implementar el backend y el **trabajo de frontend** que
se hará contra ese contrato. Nada de esto está codeado todavía.

Convenciones: todo bajo esquema `viajes`, endpoints con `X-API-KEY` + JWT (como el resto).

---

## Revisión del backend actualizado (qué existe HOY)

Revisado `ReservasViajesAPI.NET-main` (el que tiene el feedback). **Ninguno de los 3 puntos
está implementado** (cero resultados para cédula/licencia/certificación, hotel/itinerario/
inclusiones/desayuno, reagendar/reembolso). Lo que SÍ trae y es relevante:

- **Viaje** ahora tiene `ImagenUrl` (imagen real), `PublicadoPorUsuarioId` (quién lo publicó =
  vendedor) y **`EstadoPublicacion`** = `"Publicado"`/`"Pausado"`. → **Pausar el VIAJE ya existe**
  (lo setean `ViajesController`, `PublicacionesViajesController`, `AdminController`), pero **no hace
  nada con las reservas** de ese viaje (ni notifica, ni reagenda, ni reembolsa).
- Cualquier usuario puede publicar: **no hay certificación ni datos legales** en `Usuario`.
- Estados de **Reserva** usados: `Pendiente`, `Confirmada`, `Cancelada`. No hay `Pausada` de reserva.
- Existe **flujo de Pagos real** (`PagosController`, `EstadoPago`, `MetodoPago`): pagar una reserva
  la pasa a `Confirmada`. Relevante para el "devolver el dinero" del punto #3 (reembolso tocaría Pagos).
- Ya montado: `Interacciones` (likes/compartidos), `Perfil`, `Quejas`, `Admin`.

**Conclusión:** los 3 puntos hay que construirlos desde cero (backend + frontend). El único
"gancho" reaprovechable es el pausado de viaje (`EstadoPublicacion`) para el punto #3.

---

## 1) Agente certificado para ofrecer viajes

> "Para hacer un viaje se tiene que pedir: datos legales, cédula, licencia. Tiene que ser un agente certificado."

**Estado actual:** cualquier usuario logueado puede publicar (`POST /api/PublicacionesViajes`).
El form de publicar no pide credenciales legales. No existe el concepto de "agente certificado".

**Regla objetivo:** solo un **agente con certificación aprobada** puede publicar viajes.

### Contrato de API (backend)

Nueva tabla `viajes.AgenteCertificaciones`:

| Columna | Tipo | Notas |
|---|---|---|
| CertificacionId | int PK identity | |
| UsuarioId | int FK → Usuarios | uno por usuario (última vigente) |
| Cedula | nvarchar(50) | requerido |
| NumeroLicencia | nvarchar(100) | requerido |
| NombreLegal / RazonSocial | nvarchar(300) | datos legales |
| DocumentoCedulaUrl | nvarchar(500) null | archivo subido (opcional) |
| DocumentoLicenciaUrl | nvarchar(500) null | archivo subido |
| Estado | nvarchar(20) | `Pendiente` / `Aprobada` / `Rechazada` |
| MotivoRechazo | nvarchar(500) null | |
| FechaSolicitud, FechaRevision | datetime2 | |
| RevisadoPorUsuarioId | int null | admin que revisó |

| Método | Ruta | Quién | Descripción |
|---|---|---|---|
| POST | `/api/Agentes/certificacion` | usuario | Solicita certificación (multipart: Cedula, NumeroLicencia, NombreLegal, documentos). |
| GET | `/api/Agentes/certificacion/estado` | usuario | Estado de su solicitud: `{ estado, motivoRechazo }` o "ninguna". |
| GET | `/api/Agentes/certificaciones?estado=` | admin | Lista solicitudes para revisar. |
| PUT | `/api/Agentes/certificaciones/{id}/estado` | admin | `{ estado: "Aprobada"|"Rechazada", motivo }`. |
| — | `POST /api/PublicacionesViajes` | — | **Debe devolver 403** si el usuario no tiene certificación `Aprobada`. |

> Alternativa a "rol Agente": basta con que el login/`/me` devuelva `EsAgenteCertificado: bool`
> para que el frontend sepa si mostrar el flujo de publicar o el de certificación.

### Trabajo de frontend
- `/vendedor` (o `/vendedor/certificacion`): si **no** está certificado → **form de solicitud**
  (cédula, número de licencia, nombre legal, subir documentos). Si está `Pendiente` → aviso "en revisión".
  Si `Rechazada` → motivo + reintentar. Si `Aprobada` → acceso a publicar.
- Gate en `/vendedor/publicar`: sin certificación aprobada, redirige a la solicitud.
- Admin: `/admin/certificaciones` (o pestaña en `/admin/usuarios`) para aprobar/rechazar con motivo.
- Módulos: `lib/api/agentes.js`, `lib/agentes/actions.js`, componentes en `features/agentes/`.

---

## 2) "¿Qué está incluido?" real y desplegable + itinerario

> "En ida y vuelta tengo que saber qué viaje va a dar. ¿Qué está incluido? Se tiene que abrir y mostrar qué hotel, qué desayunos, a qué sitios van a ir."

**Estado actual:** en el detalle ([viajes/[id]/page.js]) el "¿Qué está incluido?", el itinerario
y las políticas son **plantilla hardcodeada**. No son reales ni desplegables. (El viaje ya tiene
`ImagenUrl` real, así que la galería puede usar la imagen del viaje en vez del placeholder; pero
hotel, desayunos, sitios e itinerario **no existen** en el modelo — solo el texto libre `Descripcion`.)

**Regla objetivo:** cada viaje guarda **hotel, régimen de comidas, inclusiones e itinerario**
(sitios por día); el detalle los muestra reales y en un **desplegable (acordeón)**.

### Contrato de API (backend)

Campos nuevos en `viajes.Viajes`: `NombreHotel nvarchar(200)`, `CategoriaHotel int null` (estrellas),
`RegimenComidas nvarchar(100)` (ej. "Desayuno buffet").

Nueva tabla `viajes.ViajeInclusiones` (checklist de lo incluido):

| Columna | Tipo |
|---|---|
| InclusionId int PK · ViajeId int FK · Tipo nvarchar(30) (`Vuelo`/`Hotel`/`Desayuno`/`Traslado`/`Excursion`/`Otro`) · Titulo nvarchar(150) · Detalle nvarchar(500) · Incluido bit | |

Nueva tabla `viajes.ViajeItinerario` (día por día):

| Columna | Tipo |
|---|---|
| ItinerarioId int PK · ViajeId int FK · Dia int · Titulo nvarchar(150) · Descripcion nvarchar(1000) · Sitios nvarchar(500) | |

| Método | Ruta | Cambio |
|---|---|---|
| GET | `/api/Viajes/{id}` | Añadir al response: `hotel {nombre, categoria, regimen}`, `inclusiones[]`, `itinerario[]`. |
| POST | `/api/PublicacionesViajes` | Aceptar `inclusiones[]` e `itinerario[]` (JSON en campos del multipart) + hotel/régimen. |
| PUT | `/api/PublicacionesViajes/{id}` | Editar inclusiones/itinerario. |

### Trabajo de frontend
- **Publicar viaje:** añadir sección "Hotel y comidas" (nombre, categoría, régimen) y filas
  **repetibles** para inclusiones (tipo + detalle) e itinerario (día + título + sitios), con agregar/quitar.
- **Detalle:** "¿Qué está incluido?" pasa a **acordeón desplegable** alimentado por `inclusiones[]`
  (cada ítem se abre y muestra el detalle: qué hotel, qué desayunos). "Itinerario" desde `itinerario[]`
  (día → sitios). Si el viaje no trae datos → fallback actual.

---

## 3) Reserva pausada → notificar al cliente (reagendar o reembolso)

> "Si hay la reserva y se pausa, hay que hacer un apartado para que el cliente sea notificado de que el viaje se va a reagendar o devolver el dinero."

**Estado actual:** estados de reserva = `Pendiente` / `Confirmada` / `Cancelada`. No hay "Pausada"
de reserva ni notificación. **Sí existe** pausar el **viaje** (`EstadoPublicacion = "Pausado"`), pero
no dispara nada en sus reservas. Ya existe `PUT /api/Reservas/{id}/estado` (cambia estado + historial)
y hay flujo de **Pagos** (el reembolso tocaría ahí).

**Regla objetivo:** cuando un viaje se **pausa** (`EstadoPublicacion = Pausado`), sus reservas
activas quedan "afectadas"; el cliente lo ve destacado en `/reservas` y elige **reagendar**
(nueva fecha) o **solicitar reembolso**. (Trigger reusa el pausado de viaje que ya existe.)

### Contrato de API (backend)

- **Reusar el pausado de viaje que ya existe:** cuando `EstadoPublicacion` pasa a `Pausado`
  (en `ViajesController`/`PublicacionesViajesController`/`AdminController`), marcar sus reservas
  activas. Dos opciones:
  - **A (recomendada):** sembrar estado de reserva `Pausada` y, al pausar el viaje, poner en `Pausada`
    todas sus reservas no canceladas (queda en el historial).
  - **B (mínima):** no tocar estados; que un endpoint derive "afectada" = reserva cuyo viaje está
    `Pausado` y no está `Cancelada`.
- Sembrar además estados `Reagendada` y `ReembolsoSolicitado`.

| Método | Ruta | Quién | Descripción |
|---|---|---|---|
| PUT | `/api/PublicacionesViajes/{id}/estado` (o `/api/Viajes/...`) | agente/admin | Ya existe; al `Pausado`, marcar reservas afectadas (opción A). |
| POST | `/api/Reservas/{id}/reagendar` | cliente | `{ nuevaDisponibilidadId }` → mueve la reserva y valida cupos. |
| POST | `/api/Reservas/{id}/reembolso` | cliente | Marca `ReembolsoSolicitado` (+ historial). Se conecta con **Pagos** para la devolución. |
| GET | `/api/Notificaciones` (opcional) | usuario | Para el ícono de campana. |

> Notificación mínima viable: **no** hace falta tabla de notificaciones para el MVP — basta con
> mostrar el estado `Pausada` de forma destacada en `/reservas`. La tabla `Notificaciones`
> (NotificacionId, UsuarioId, Tipo, Mensaje, ReservaId, Leida, Fecha) es un plus para la campana.

### Trabajo de frontend
- **`/reservas`:** las reservas `Pausada` muestran un **banner de acción**: "Tu viaje fue pausado.
  Elige: **Reagendar** o **Solicitar reembolso**", con los dos botones.
  - Reagendar → modal para elegir nueva fecha entre las disponibilidades del viaje → `POST .../reagendar`.
  - Reembolso → confirmación → `POST .../reembolso`.
- **Agente/Admin:** acción "Pausar reserva" en `/admin/reservas` (o `/vendedor`).
- (Opcional) La **campana** del header muestra el conteo de notificaciones.

---

## Roadmap sugerido

| Orden | Feature | Por qué | Depende de backend |
|---|---|---|---|
| 1º | **#2 Qué incluye + itinerario** | Es lo más visible y evaluable; mejora directa del detalle. | Campos + 2 tablas + extender GET/POST |
| 2º | **#1 Agente certificado** | Da estructura al rol vendedor; gatea la publicación. | Tabla + 4 endpoints + gate en publicar |
| 3º | **#3 Reserva pausada** | Reusa el mecanismo de estados existente. | 3 estados + 2 endpoints |

**Dependencia dura:** cada bloque de frontend no puede terminarse hasta que exista su endpoint.
Estrategia: por cada feature, backend implementa el contrato de arriba → frontend construye contra él
(con fallback elegante mientras tanto, como ya hacemos con 401/datos faltantes).

## Checklist para el equipo de backend (.NET)
- [ ] #1: tabla `AgenteCertificaciones` + 4 endpoints `/api/Agentes/*` + 403 en publicar si no certificado.
- [ ] #2: campos hotel/régimen en `Viajes` + tablas `ViajeInclusiones` e `ViajeItinerario` + extender `GET /api/Viajes/{id}` y el POST de publicar.
- [ ] #3: sembrar estados `Pausada`/`Reagendada`/`ReembolsoSolicitado` + `POST /api/Reservas/{id}/reagendar` y `.../reembolso`.

> Todos siguen los patrones existentes (esquema `viajes`, `X-API-KEY` + JWT, respuestas que el
> frontend ya lee en camelCase/PascalCase).

---

## Estado del frontend (YA construido, esperando el backend)

El frontend de los 3 ya está hecho, con **fallback elegante** mientras el API no responda esos
campos/endpoints. Cuando el backend esté listo, solo hay que ajustar los módulos `lib/api/*`
marcados con "AJUSTAR". Campos/rutas que el frontend **espera** (lee tolerante camelCase/PascalCase):

**#2 — `GET /api/Viajes/{id}` debe agregar:**
- `inclusiones: [{ tipo, titulo, detalle }]`
- `itinerario: [{ dia, titulo, descripcion, sitios }]`
- hotel: `nombreHotel` + `categoriaHotel` + `regimenComidas` (o un objeto `hotel {nombre, categoria, regimen}`)
- El form de publicar ya **envía** en el multipart: `NombreHotel`, `CategoriaHotel`, `RegimenComidas`,
  `Inclusiones` (JSON), `Itinerario` (JSON). Componente: `features/viajes/TripInclusions.jsx` (acordeón).

**#1 — endpoints `/api/Agentes/*`:**
- `GET /api/Agentes/certificacion/estado` → `{ estado: "Ninguna"|"Pendiente"|"Aprobada"|"Rechazada" }`
- `POST /api/Agentes/certificacion` (multipart: `Cedula`, `NumeroLicencia`, `NombreLegal`, `DocumentoCedula`, `DocumentoLicencia`)
- `POST /api/PublicacionesViajes` debe devolver **403** si no está aprobado (el frontend ya muestra el error).
- Frontend: `/vendedor/certificacion` (form/estado) + aviso en `/vendedor/publicar`. Módulo `lib/api/agentes.js`.

**#3 — reserva pausada:**
- Que la reserva se marque como afectada: estado `Pausada` **o** que `GET /api/Reservas` incluya
  `disponibilidad.viaje.estadoPublicacion` (el frontend detecta `"Pausado"`/`"Pausada"`).
- `POST /api/Reservas/{id}/reembolso` y `POST /api/Reservas/{id}/reagendar` (`{ nuevaDisponibilidadId }`).
- Frontend: banner en cada reserva pausada (`features/reservas/ReservaPausadaBanner.jsx`) con
  "Reagendar" y "Solicitar reembolso". Módulo `lib/api/reservas.js`, acciones `lib/reservas/actions.js`.

Todo compila y no rompe nada actual: sin datos → fallback/plantilla; sin endpoint → no se muestra.
