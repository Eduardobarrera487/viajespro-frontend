"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { crearReserva, reagendarReserva, solicitarReembolso } from "@/lib/api/reservas";
import { getSession } from "@/lib/auth/session";

/** Mensaje legible desde un cuerpo de error de la API (texto plano o ModelState). */
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
 * Crea la reserva en la BD (POST /api/Reservas) con sus pasajeros y, si todo va
 * bien, redirige a la confirmación con el id real de la reserva.
 *
 * @param {import("@/lib/reservas/state").ReservaState} _prevState
 * @param {FormData} formData
 * @returns {Promise<import("@/lib/reservas/state").ReservaState>}
 */
export async function crearReservaAction(_prevState, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const viajeId = Number(formData.get("viajeId"));
  const disponibilidadId = Number(formData.get("disponibilidadId"));
  const viajeros = Math.max(1, Number(formData.get("viajeros")) || 1);
  const acepto = formData.get("acepto") === "on";

  if (!acepto) {
    return { error: "Debes aceptar las políticas y condiciones para continuar.", fieldErrors: {} };
  }
  if (!disponibilidadId) {
    return { error: "No hay una fecha de viaje seleccionada. Vuelve al detalle y elígela.", fieldErrors: {} };
  }

  // Construir la lista de pasajeros desde el formulario.
  const fieldErrors = {};
  const pasajeros = [];

  // Pasajero principal: nombre del usuario logueado + documento del form.
  const doc1 = (formData.get("doc_1") ?? "").toString().trim();
  if (!doc1) fieldErrors.doc_1 = "Ingresa el documento.";
  pasajeros.push({
    NombreCompleto: session.usuario?.nombre?.trim() || "Titular",
    Documento: doc1,
  });

  // Acompañantes.
  for (let n = 2; n <= viajeros; n++) {
    const nombre = (formData.get(`nombre_${n}`) ?? "").toString().trim();
    const doc = (formData.get(`doc_${n}`) ?? "").toString().trim();
    if (!nombre) fieldErrors[`nombre_${n}`] = "Ingresa el nombre.";
    if (!doc) fieldErrors[`doc_${n}`] = "Ingresa el documento.";
    pasajeros.push({ NombreCompleto: nombre, Documento: doc });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Completa los datos de todos los viajeros.", fieldErrors };
  }

  let reservaId;
  try {
    const res = await crearReserva({
      UsuarioId: session.usuario?.usuarioId,
      DisponibilidadId: disponibilidadId,
      CantidadPersonas: viajeros,
      Pasajeros: pasajeros,
    });

    if (res.status === 401) redirect("/auth");
    if (!res.ok) {
      return { error: apiErrorMessage(res.data, "No se pudo crear la reserva."), fieldErrors: {} };
    }
    reservaId = res.data?.reservaId;
  } catch {
    return { error: "Ocurrió un error al crear la reserva. Inténtalo de nuevo.", fieldErrors: {} };
  }

  // Éxito: a la confirmación con el id real (fuera del try para que redirect propague).
  redirect(`/viajes/${viajeId}/reservar/confirmacion?reserva=${reservaId}`);
}

/**
 * Punto #3 — el cliente solicita el reembolso de una reserva pausada.
 * @param {{ ok: boolean, error: string | null }} _prev
 */
export async function solicitarReembolsoAction(_prev, formData) {
  const reservaId = Number(formData.get("reservaId"));
  if (!reservaId) return { ok: false, error: "Reserva inválida." };

  try {
    const res = await solicitarReembolso(reservaId);
    if (res.status === 401) redirect("/logout");
    if (!res.ok) return { ok: false, error: apiErrorMessage(res.data, "No se pudo solicitar el reembolso.") };
  } catch {
    return { ok: false, error: "Ocurrió un error. Inténtalo de nuevo." };
  }

  revalidatePath("/reservas");
  return { ok: true, error: null };
}

/**
 * Punto #3 — el cliente reagenda una reserva pausada a otra fecha.
 * @param {{ ok: boolean, error: string | null }} _prev
 */
export async function reagendarReservaAction(_prev, formData) {
  const reservaId = Number(formData.get("reservaId"));
  const nuevaDisponibilidadId = Number(formData.get("nuevaDisponibilidadId"));
  if (!reservaId || !nuevaDisponibilidadId) return { ok: false, error: "Selecciona una nueva fecha." };

  try {
    const res = await reagendarReserva(reservaId, nuevaDisponibilidadId);
    if (res.status === 401) redirect("/logout");
    if (!res.ok) return { ok: false, error: apiErrorMessage(res.data, "No se pudo reagendar la reserva.") };
  } catch {
    return { ok: false, error: "Ocurrió un error. Inténtalo de nuevo." };
  }

  revalidatePath("/reservas");
  return { ok: true, error: null };
}
