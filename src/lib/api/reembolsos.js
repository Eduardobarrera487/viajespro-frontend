import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

/**
 * Solicitudes de reembolso (solo Admin). Contrato: /api/Reembolsos.
 */

/** Lista de solicitudes de reembolso, opcionalmente filtradas por estado. */
export async function getReembolsos(estado) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  const qs = estado ? `?estado=${encodeURIComponent(estado)}` : "";
  return apiFetch(`/api/Reembolsos${qs}`, { token: session.token });
}

/**
 * Resuelve una solicitud: Aprobada | Rechazada | Procesada.
 * @param {number} solicitudId
 * @param {{ estado: string, montoAprobado?: number|null, observacion?: string|null }} data
 */
export async function resolverReembolso(solicitudId, { estado, montoAprobado, observacion } = {}) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch(`/api/Reembolsos/${Number(solicitudId)}/resolver`, {
    method: "PUT",
    body: {
      Estado: estado,
      MontoAprobado: montoAprobado ?? null,
      Observacion: observacion ?? null,
    },
    token: session.token,
  });
}
