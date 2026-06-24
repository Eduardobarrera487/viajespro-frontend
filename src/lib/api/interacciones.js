import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

async function authed(path, options = {}) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };

  return apiFetch(path, {
    ...options,
    token: session.token,
    cache: "no-store",
  });
}

export async function getMisLikes() {
  return authed("/api/Interacciones/likes");
}

export async function getLikeEstado(viajeId) {
  return authed(`/api/Interacciones/likes/${Number(viajeId)}/estado`);
}

export async function toggleLikeViaje(viajeId) {
  return authed(`/api/Interacciones/likes/${Number(viajeId)}/toggle`, {
    method: "POST",
  });
}

export async function registrarCompartido(payload) {
  return authed("/api/Interacciones/compartidos", {
    method: "POST",
    body: payload,
  });
}
