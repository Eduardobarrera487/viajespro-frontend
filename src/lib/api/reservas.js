import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

/**
 * Reservas del usuario logueado.
 *
 * El endpoint GET /api/Reservas devuelve TODAS las reservas (no filtra por
 * usuario), así que filtramos aquí por el usuarioId de la sesión.
 * (Mejora pendiente en el backend: scopear por el usuario autenticado.)
 *
 * @returns {Promise<{ ok: boolean, status: number, data: object[] | null }>}
 */
export async function getMisReservas() {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };

  const res = await apiFetch("/api/Reservas", { token: session.token });
  if (!res.ok || !Array.isArray(res.data)) return res;

  const usuarioId = session.usuario?.usuarioId;
  const mias = usuarioId
    ? res.data.filter((r) => r.usuarioId === usuarioId)
    : res.data;

  return { ...res, data: mias };
}

/**
 * Crea una reserva: POST /api/Reservas (requiere sesión).
 * @param {object} payload - Cuerpo CrearReservaDto.
 */
export async function crearReserva(payload) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch("/api/Reservas", {
    method: "POST",
    body: payload,
    token: session.token,
  });
}

/**
 * Detalle de una reserva: GET /api/Reservas/{id} (requiere sesión).
 * @param {number} reservaId
 */
export async function getReserva(reservaId) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch(`/api/Reservas/${reservaId}`, { token: session.token });
}
