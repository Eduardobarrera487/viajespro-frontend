"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { resolverReembolso } from "@/lib/api/reembolsos";
import { getSession } from "@/lib/auth/session";

/** Mensaje legible desde el cuerpo de error del API ({message}, ModelState o texto). */
function apiErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (data && typeof data === "object") {
    if (data.message ?? data.Message) return String(data.message ?? data.Message);
    const errors = data.errors ?? data;
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }
  return fallback;
}

/**
 * (Admin) Resuelve una solicitud de reembolso. Devuelve estado para useActionState.
 * @param {{ ok: boolean, error: string | null }} _prev
 * @returns {Promise<{ ok: boolean, error: string | null }>}
 */
export async function resolverReembolsoAction(_prev, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const solicitudId = Number(formData.get("solicitudId"));
  const estado = String(formData.get("estado") ?? "").trim(); // Aprobada | Rechazada | Procesada
  const montoRaw = formData.get("montoAprobado");
  const montoAprobado =
    montoRaw !== null && String(montoRaw).trim() !== "" ? Number(montoRaw) : null;
  const observacion = String(formData.get("observacion") ?? "").trim() || null;

  if (!solicitudId || !estado) return { ok: false, error: "Datos incompletos." };

  try {
    const res = await resolverReembolso(solicitudId, { estado, montoAprobado, observacion });
    if (res.status === 401) redirect("/logout");
    if (!res.ok) {
      return { ok: false, error: apiErrorMessage(res.data, "No se pudo resolver la solicitud.") };
    }
  } catch {
    return { ok: false, error: "Ocurrió un error. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/reembolsos");
  return { ok: true, error: null };
}
