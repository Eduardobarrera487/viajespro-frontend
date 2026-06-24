import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

async function authed(path, options = {}) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };

  return apiFetch(path, {
    ...options,
    token: session.token,
    init: {
      cache: "no-store",
      ...(options.init || {}),
    },
  });
}

export async function getMiPerfil() {
  return authed("/api/Perfil");
}

export async function actualizarMiPerfil(payload) {
  return authed("/api/Perfil", {
    method: "PUT",
    body: payload,
  });
}

export async function cambiarPasswordPerfil(payload) {
  return authed("/api/Perfil/password", {
    method: "PUT",
    body: payload,
  });
}
