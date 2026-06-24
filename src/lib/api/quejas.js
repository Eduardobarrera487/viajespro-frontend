import "server-only";

import { apiFetch } from "@/lib/api/client";
import { getSession } from "@/lib/auth/session";

async function authed(path, options = {}) {
  const session = await getSession();
  if (!session?.token) return { ok: false, status: 401, data: null };
  return apiFetch(path, { ...options, token: session.token });
}

export async function getMisQuejas() {
  return authed("/api/Quejas/mis-quejas");
}

export async function crearQueja(payload) {
  return authed("/api/Quejas", {
    method: "POST",
    body: payload,
  });
}
