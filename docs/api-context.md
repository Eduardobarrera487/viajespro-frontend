# Contexto de la API (.NET — AppReservasAPI)

Backend que consume este frontend. Proyecto independiente (no se modifica desde aquí).
Ubicación local del código: `D:\Descargas\API de viajes\AppReservasAPI`.

## Conexión

| | Valor |
|---|---|
| Base URL (dev http) | `http://localhost:5098` |
| Base URL (dev https) | `https://localhost:7028` |
| Auth | JWT Bearer (expira a los 120 min) |
| **API Key (obligatoria en todo `/api`)** | header `X-API-KEY` |

> ⚠️ **Toda** petición a `/api/*` exige el header `X-API-KEY` (lo impone `ApiKeyMiddleware`).
> Es un secreto: vive solo en el servidor (`API_KEY` en `.env.local`) y se inyecta
> en [`src/lib/api/client.js`](../src/lib/api/client.js). **Nunca** debe llegar al cliente
> (sin `NEXT_PUBLIC_`, módulos con `import "server-only"`).

Variables de entorno (ver [`.env.example`](../.env.example)):

```
API_BASE_URL=http://localhost:5098
API_KEY=...   # X-API-KEY que espera el backend
```

## Endpoints de autenticación

Todos bajo `/api/Auth`. `login` y `registro` son `[AllowAnonymous]` pero **igual requieren la API Key**.

### POST `/api/Auth/login`
```jsonc
// body
{ "Email": "user@mail.com", "Password": "secreta" }
// 200 OK
{ "mensaje": "Login correcto.", "token": "<jwt>", "tipo": "Bearer",
  "usuario": { "usuarioId", "nombre", "email", "telefono", "rolId", "rol" },
  "permisos": [ { "pantallaId", "pantalla", "ruta", "modulo", "icono", "orden",
                  "permisoId", "codigoPermiso", "permiso" } ] }
// 401 → cuerpo texto plano: "Credenciales incorrectas." | "El usuario está desactivado."
```

### POST `/api/Auth/registro`
```jsonc
// body — Telefono es opcional. Password mínimo 6 caracteres.
{ "Nombre": "Juan Pérez", "Email": "user@mail.com", "Password": "secreta", "Telefono": "+503..." }
// 200 OK → crea usuario con rol "Cliente". NO devuelve token.
{ "mensaje": "Usuario registrado correctamente.", "usuario": { ... } }
// 400 → texto plano "Ya existe un usuario registrado con ese correo." | ModelState
```

### GET `/api/Auth/me`  ·  GET `/api/Auth/permisos/{usuarioId}`
Requieren `Authorization: Bearer <token>`. Devuelven usuario + permisos.

## Manejo de errores

La API responde errores como **texto plano** (la mayoría) o como objeto **ModelState**
(`{ errors: { Campo: ["msg"] } }`). El helper `apiErrorMessage()` en
[`src/lib/auth/actions.js`](../src/lib/auth/actions.js) normaliza ambos.

## Flujo implementado en el frontend

1. **Login** → `loginAction` → `/api/Auth/login` → guarda `{ token, usuario }` en cookie
   httpOnly (`vp_session`) → `redirect("/")`.
2. **Registro** → `registerAction` → `/api/Auth/registro` → auto-login con las mismas
   credenciales → cookie → `redirect("/")`.

Archivos clave: `src/lib/api/client.js`, `src/lib/auth/{actions,session}.js`,
`src/lib/validations.js`, `src/components/features/auth/*`.

## Otros recursos de la API (para features futuras)

CRUD disponible (todos requieren API Key; la mayoría además JWT): `Ciudades`, `Paises`,
`Destinos`, `Viajes`, `TipoViajes`, `Disponibilidades`, `Reservas`, `PasajeroReservas`,
`EstadoReservas`, `HistorialEstadoReservas`, `Pagos`, `EstadoPagos`, `MetodoPagos`,
`Usuarios`, `Roles`, `Permisos`, `Pantallas`, `RolPantallaPermisos`.
Swagger: `http://localhost:5098/swagger`.
