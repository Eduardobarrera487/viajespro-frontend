import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

async function authed(path, options = {}) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch(path, { ...options, token: session.token });
}

export async function getAdminDashboard() {
  return authed("/api/Admin/dashboard");
}

export async function getAdminUsuarios() {
  return authed("/api/Admin/usuarios");
}

export async function getAdminRoles() {
  return authed("/api/Admin/roles");
}

export async function getAdminViajes() {
  return authed("/api/Admin/viajes");
}

export async function getAdminReservas() {
  return authed("/api/Admin/reservas");
}

export async function getAdminEstadosReserva() {
  return authed("/api/Admin/estados-reserva");
}

export async function getAdminQuejas() {
  return authed("/api/Quejas/admin");
}

export async function cambiarEstadoUsuario(usuarioId, activo) {
  return authed(`/api/Admin/usuarios/${usuarioId}/estado`, {
    method: "PUT",
    body: { activo },
  });
}

export async function cambiarRolUsuario(usuarioId, rolId) {
  return authed(`/api/Admin/usuarios/${usuarioId}/rol`, {
    method: "PUT",
    body: { rolId },
  });
}

export async function cambiarEstadoViajeAdmin(viajeId, activo) {
  return authed(`/api/Admin/viajes/${viajeId}/estado`, {
    method: "PUT",
    body: { activo },
  });
}

export async function cambiarEstadoReservaAdmin(reservaId, estadoReservaId, motivo) {
  return authed(`/api/Admin/reservas/${reservaId}/estado`, {
    method: "PUT",
    body: { estadoReservaId, motivo },
  });
}

export async function resolverQuejaAdmin(quejaId, estado, respuestaAdmin) {
  return authed(`/api/Quejas/${quejaId}/resolver`, {
    method: "PUT",
    body: { estado, respuestaAdmin },
  });
}
