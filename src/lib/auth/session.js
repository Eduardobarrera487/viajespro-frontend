import "server-only";

import { cookies } from "next/headers";

const SESSION_COOKIE = "vp_session";

/**
 * Guarda el JWT y los datos básicos del usuario en una cookie httpOnly.
 * La cookie no es accesible desde JavaScript del cliente (mitiga XSS).
 *
 * @param {{ token: string, usuario: object }} session
 */
export async function createSession({ token, usuario }) {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify({ token, usuario }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // El JWT de la API expira en 120 min; alineamos la cookie.
    maxAge: 60 * 120,
  });
}

/** Devuelve la sesión actual ({ token, usuario }) o null si no hay. */
export async function getSession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Elimina la sesión (logout). */
export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
