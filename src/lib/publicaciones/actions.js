"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  cambiarEstadoPublicacion,
  crearPublicacionViaje,
} from "@/lib/api/publicaciones";
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

function getFormValues(formData) {
  return {
    Titulo: String(formData.get("Titulo") ?? "").trim(),
    TipoViajeId: String(formData.get("TipoViajeId") ?? "").trim(),
    Precio: String(formData.get("Precio") ?? "").trim(),
    Pais: String(formData.get("Pais") ?? "").trim(),
    Ciudad: String(formData.get("Ciudad") ?? "").trim(),
    FechaSalida: String(formData.get("FechaSalida") ?? "").trim(),
    FechaRetorno: String(formData.get("FechaRetorno") ?? "").trim(),
    CuposTotales: String(formData.get("CuposTotales") ?? "").trim(),
    Descripcion: String(formData.get("Descripcion") ?? "").trim(),
    DestinoDescripcion: String(formData.get("DestinoDescripcion") ?? "").trim(),
  };
}

function getTodayDateOnly() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseInputDate(value) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export async function publicarViajeAction(_prevState, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const values = getFormValues(formData);

  const tipoViajeId = Number(values.TipoViajeId);
  const precio = Number(values.Precio);
  const cupos = Number(values.CuposTotales);
  const fechaSalida = parseInputDate(values.FechaSalida);
  const fechaRetorno = parseInputDate(values.FechaRetorno);
  const today = getTodayDateOnly();

  const fieldErrors = {};

  if (!values.Titulo) fieldErrors.Titulo = "Ingresá el título del viaje.";
  if (!values.Pais) fieldErrors.Pais = "Ingresá el país.";
  if (!values.Ciudad) fieldErrors.Ciudad = "Ingresá la ciudad.";
  if (!tipoViajeId) fieldErrors.TipoViajeId = "Seleccioná el tipo de viaje.";
  if (!precio || precio <= 0) fieldErrors.Precio = "Ingresá un precio válido.";
  if (!cupos || cupos <= 0) fieldErrors.CuposTotales = "Ingresá cupos válidos.";
  if (!fechaSalida) fieldErrors.FechaSalida = "Seleccioná la fecha de salida.";

  if (fechaSalida && fechaSalida < today) {
    fieldErrors.FechaSalida = "No se puede publicar un viaje con fecha de salida pasada.";
  }

  if (fechaSalida && fechaRetorno && fechaRetorno < fechaSalida) {
    fieldErrors.FechaRetorno = "La fecha de retorno no puede ser menor que la fecha de salida.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Revisá los datos del formulario.",
      fieldErrors,
      values,
    };
  }

  const res = await crearPublicacionViaje(formData);

  if (res.status === 401) redirect("/auth");

  if (!res.ok) {
    return {
      error: apiErrorMessage(res.data, "No se pudo publicar el viaje."),
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/");
  revalidatePath("/vendedor/mis-viajes");
  redirect("/vendedor/mis-viajes?publicado=1");
}

export async function cambiarEstadoPublicacionAction(formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const viajeId = Number(formData.get("viajeId"));
  const activo = String(formData.get("activo")) === "true";

  if (!viajeId) {
    return;
  }

  await cambiarEstadoPublicacion(viajeId, activo);

  revalidatePath("/");
  revalidatePath("/vendedor/mis-viajes");
  revalidatePath("/vendedor/admin");
}
