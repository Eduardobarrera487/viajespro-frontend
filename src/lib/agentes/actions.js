"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { solicitarCertificacion, revisarCertificacion } from "@/lib/api/agentes";
import { getSession } from "@/lib/auth/session";

function apiErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (data && typeof data === "object") {
    const errors = data.errors ?? data;
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }
  return fallback;
}

/**
 * Punto #1 — el usuario solicita certificación como agente.
 * @param {{ error: string | null, fieldErrors: object, ok: boolean }} _prev
 */
export async function solicitarCertificacionAction(_prev, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const cedula = String(formData.get("Cedula") ?? "").trim();
  const licencia = String(formData.get("NumeroLicencia") ?? "").trim();
  const nombreLegal = String(formData.get("NombreLegal") ?? "").trim();

  const fieldErrors = {};
  if (!cedula) fieldErrors.Cedula = "Ingresá tu número de cédula.";
  if (!licencia) fieldErrors.NumeroLicencia = "Ingresá tu número de licencia.";
  if (!nombreLegal) fieldErrors.NombreLegal = "Ingresá el nombre o razón social.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Completá los datos legales.", fieldErrors, ok: false };
  }

  try {
    const res = await solicitarCertificacion(formData);
    if (res.status === 401) redirect("/logout");
    if (res.status === 404) {
      return {
        error: "El módulo de certificación aún no está disponible en el servidor.",
        fieldErrors: {},
        ok: false,
      };
    }
    if (!res.ok) {
      return { error: apiErrorMessage(res.data, "No se pudo enviar la solicitud."), fieldErrors: {}, ok: false };
    }
  } catch {
    return { error: "Ocurrió un error. Inténtalo de nuevo.", fieldErrors: {}, ok: false };
  }

  revalidatePath("/vendedor/certificacion");
  return { error: null, fieldErrors: {}, ok: true };
}

/**
 * Punto #1 (admin) — aprueba o rechaza una certificación. Form plano (un solo arg).
 */
export async function revisarCertificacionAction(formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const certificacionId = Number(formData.get("certificacionId"));
  const estado = String(formData.get("estado") ?? "").trim(); // "Aprobada" | "Rechazada"
  const motivo = String(formData.get("motivo") ?? "").trim();
  if (!certificacionId || !estado) return;

  await revisarCertificacion(certificacionId, { estado, motivo });
  revalidatePath("/admin/certificaciones");
}
