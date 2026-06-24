"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { crearQueja } from "@/lib/api/quejas";
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

export async function crearQuejaAction(_prevState, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const tipo = String(formData.get("tipo") ?? "General").trim();
  const asunto = String(formData.get("asunto") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const reservaIdRaw = String(formData.get("reservaId") ?? "").trim();
  const viajeIdRaw = String(formData.get("viajeId") ?? "").trim();

  const values = { tipo, asunto, descripcion, reservaId: reservaIdRaw, viajeId: viajeIdRaw };
  const fieldErrors = {};

  if (!asunto) fieldErrors.asunto = "Ingresá el asunto.";
  if (!descripcion) fieldErrors.descripcion = "Describí la queja o solicitud.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Revisá los datos.", fieldErrors, values };
  }

  const payload = {
    tipo: tipo || "General",
    asunto,
    descripcion,
    reservaId: reservaIdRaw ? Number(reservaIdRaw) : null,
    viajeId: viajeIdRaw ? Number(viajeIdRaw) : null,
  };

  const res = await crearQueja(payload);
  if (res.status === 401) redirect("/auth");

  if (!res.ok) {
    return {
      error: apiErrorMessage(res.data, "No se pudo enviar la queja."),
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/quejas");
  revalidatePath("/admin/quejas");
  return { ok: true, error: "", fieldErrors: {}, values: {} };
}
