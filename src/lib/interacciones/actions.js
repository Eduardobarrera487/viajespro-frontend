"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { registrarCompartido, toggleLikeViaje } from "@/lib/api/interacciones";
import { getSession } from "@/lib/auth/session";

export async function toggleLikeViajeAction(viajeId) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const id = Number(viajeId);
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, error: "Viaje inválido." };
  }

  const res = await toggleLikeViaje(id);

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: typeof res.data === "string" ? res.data : "No se pudo guardar el like.",
    };
  }

  revalidatePath("/reservas");
  revalidatePath("/likes");
  revalidatePath("/");
  revalidatePath(`/viajes/${id}`);

  return {
    ok: true,
    liked: Boolean(res.data?.liked ?? res.data?.Liked),
    totalLikes: Number(res.data?.totalLikes ?? res.data?.TotalLikes ?? 0),
  };
}

export async function registrarCompartidoAction(payload) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const body = {
    viajeId: payload?.viajeId ? Number(payload.viajeId) : null,
    reservaId: payload?.reservaId ? Number(payload.reservaId) : null,
    canal: payload?.canal || "web",
    url: payload?.url || null,
  };

  if (!body.viajeId && !body.reservaId) {
    return { ok: false, error: "No hay viaje o reserva para compartir." };
  }

  const res = await registrarCompartido(body);

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: typeof res.data === "string" ? res.data : "No se pudo registrar el compartido.",
    };
  }

  revalidatePath("/admin");
  return { ok: true, compartidoId: res.data?.compartidoId ?? res.data?.CompartidoId };
}
