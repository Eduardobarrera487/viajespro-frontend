import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

/**
 * Actualiza una disponibilidad (fecha, retorno, cupos): PUT /api/Disponibilidades/{id}.
 * Requiere que el viaje esté activo (el backend rechaza viajes inactivos).
 *
 * @param {number} disponibilidadId
 * @param {{ ViajeId: number, Fecha: string, FechaRetorno?: string|null, CuposTotales: number, Activo: boolean }} payload
 */
export async function actualizarDisponibilidad(disponibilidadId, payload) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch(`/api/Disponibilidades/${Number(disponibilidadId)}`, {
    method: "PUT",
    body: payload,
    token: session.token,
  });
}
