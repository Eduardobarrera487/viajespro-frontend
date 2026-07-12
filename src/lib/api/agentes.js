import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";
import { toProxyImage } from "@/lib/img";

/**
 * Punto #1 — certificación de agentes de viaje.
 * AJUSTAR rutas/DTO cuando exista el backend (`/api/Agentes/*`).
 */

/** Estado de la certificación del usuario logueado. */
export async function getMiCertificacion() {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch("/api/Agentes/certificacion/estado", { token: session.token });
}

/** Solicita certificación (multipart: cédula, licencia, nombre legal, documentos). */
export async function solicitarCertificacion(formData) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  // init.body = FormData → apiFetch no serializa a JSON y el navegador pone el boundary.
  return apiFetch("/api/Agentes/certificacion", {
    method: "POST",
    token: session.token,
    init: { body: formData },
  });
}

/** (Admin) Lista solicitudes de certificación. */
export async function getCertificaciones(estado) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  const qs = estado ? `?estado=${encodeURIComponent(estado)}` : "";
  const res = await apiFetch(`/api/Agentes/certificaciones${qs}`, { token: session.token });
  if (res.ok && Array.isArray(res.data)) {
    for (const c of res.data) {
      c.documentoCedulaUrl = toProxyImage(c.documentoCedulaUrl ?? c.DocumentoCedulaUrl);
      c.documentoLicenciaUrl = toProxyImage(c.documentoLicenciaUrl ?? c.DocumentoLicenciaUrl);
    }
  }
  return res;
}

/** (Admin) Aprueba o rechaza una certificación. */
export async function revisarCertificacion(certificacionId, { estado, motivo } = {}) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch(`/api/Agentes/certificaciones/${Number(certificacionId)}/estado`, {
    method: "PUT",
    body: { Estado: estado, MotivoRechazo: motivo }, // nombres exactos del DTO
    token: session.token,
  });
}

/**
 * Indica si el usuario puede publicar viajes.
 *  - Aprobada → true.
 *  - Estado no-aprobado explícito → false (backend con certificación activa).
 *  - Endpoint inexistente (404) / error → null = "el módulo aún no exige certificación".
 */
export async function estadoCertificacion() {
  try {
    const res = await getMiCertificacion();
    if (res.status === 404 || !res.ok) return { disponible: false, estado: null, motivo: null };
    // Respuesta real: { tieneSolicitud, certificado, certificacion: { estado, motivoRechazo } | null }
    const d = res.data ?? {};
    const cert = d.certificacion ?? d.Certificacion ?? null;
    const certificado = d.certificado ?? d.Certificado ?? false;
    const estado = certificado ? "aprobada" : String(cert?.estado ?? cert?.Estado ?? "").toLowerCase();
    const motivo = cert?.motivoRechazo ?? cert?.MotivoRechazo ?? null;
    return { disponible: true, estado, motivo };
  } catch {
    // API caída o módulo inexistente → no exigir certificación (degradado).
    return { disponible: false, estado: null, motivo: null };
  }
}
