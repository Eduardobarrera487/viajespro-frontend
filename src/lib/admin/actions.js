"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  cambiarEstadoReservaAdmin,
  cambiarEstadoUsuario,
  cambiarEstadoViajeAdmin,
  cambiarRolUsuario,
  resolverQuejaAdmin,
} from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

async function requireSession() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  return session;
}

export async function cambiarEstadoUsuarioAction(formData) {
  await requireSession();
  const usuarioId = Number(formData.get("usuarioId"));
  const activo = String(formData.get("activo")) === "true";
  if (!usuarioId) return;

  await cambiarEstadoUsuario(usuarioId, activo);
  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
}

export async function cambiarRolUsuarioAction(formData) {
  await requireSession();
  const usuarioId = Number(formData.get("usuarioId"));
  const rolId = Number(formData.get("rolId"));
  if (!usuarioId || !rolId) return;

  await cambiarRolUsuario(usuarioId, rolId);
  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/roles");
}

export async function cambiarEstadoViajeAdminAction(formData) {
  await requireSession();
  const viajeId = Number(formData.get("viajeId"));
  const activo = String(formData.get("activo")) === "true";
  if (!viajeId) return;

  await cambiarEstadoViajeAdmin(viajeId, activo);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/viajes");
  revalidatePath("/vendedor/mis-viajes");
}

export async function cambiarEstadoReservaAdminAction(formData) {
  await requireSession();
  const reservaId = Number(formData.get("reservaId"));
  const estadoReservaId = Number(formData.get("estadoReservaId"));
  const motivo = String(formData.get("motivo") ?? "").trim();
  if (!reservaId || !estadoReservaId) return;

  await cambiarEstadoReservaAdmin(reservaId, estadoReservaId, motivo);
  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
  revalidatePath("/reservas");
}

export async function resolverQuejaAdminAction(formData) {
  await requireSession();
  const quejaId = Number(formData.get("quejaId"));
  const estado = String(formData.get("estado") ?? "Pendiente").trim();
  const respuestaAdmin = String(formData.get("respuestaAdmin") ?? "").trim();
  if (!quejaId) return;

  await resolverQuejaAdmin(quejaId, estado, respuestaAdmin);
  revalidatePath("/admin");
  revalidatePath("/admin/quejas");
  revalidatePath("/quejas");
}
