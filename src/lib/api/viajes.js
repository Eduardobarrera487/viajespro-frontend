import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

/**
 * Convierte una URL de imagen relativa (p.ej. `/uploads/viajes/x.jpg`) en absoluta
 * usando API_BASE_URL. `GET /api/Viajes[...]` devuelve la ruta relativa (stub del
 * backend `ToAbsoluteImageUrl`), y el navegador la resolvería contra el front.
 */
function toAbsoluteImagen(url) {
  if (!url) return url ?? null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
  return `${base}${String(url).startsWith("/") ? "" : "/"}${url}`;
}

/** Normaliza `imagenUrl` de un viaje a URL absoluta (mutación in-place). */
function normalizarImagen(viaje) {
  if (viaje && typeof viaje === "object") {
    const raw = viaje.imagenUrl ?? viaje.ImagenUrl;
    viaje.imagenUrl = toAbsoluteImagen(raw);
  }
  return viaje;
}

/**
 * Detalle de un viaje: GET /api/Viajes/{id}.
 * El endpoint es [Authorize], así que enviamos el JWT de la sesión.
 * Devuelve { ok, status, data } (status 401 si no hay sesión).
 *
 * @param {number} viajeId
 */
export async function getViaje(viajeId) {
  const session = await getSession();
  // Token opcional: si el backend marca el GET como AllowAnonymous, funciona sin sesión.
  const res = await apiFetch(`/api/Viajes/${viajeId}`, { token: session?.token });
  if (res.ok) normalizarImagen(res.data);
  return res;
}

/**
 * Listado de viajes: GET /api/Viajes (con filtros opcionales).
 * @param {Record<string, string | number | boolean>} [params]
 */
export async function getViajes(params = {}) {
  const session = await getSession();
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  const res = await apiFetch(`/api/Viajes${qs ? `?${qs}` : ""}`, { token: session?.token });
  if (res.ok && Array.isArray(res.data)) res.data.forEach(normalizarImagen);
  return res;
}

/**
 * Tipos de viaje activos: GET /api/TipoViajes?activo=true.
 * @returns {Promise<{ ok: boolean, status: number, data: object[] | null }>}
 */
export async function getTipos() {
  const session = await getSession();
  return apiFetch("/api/TipoViajes?activo=true", { token: session?.token });
}
