import { NextResponse } from "next/server";

/**
 * Cierra la sesión borrando la cookie y va a /auth.
 * Se usa tanto para logout manual como cuando el API responde 401 con una
 * cookie inválida/expirada (rompe el bucle de redirección /auth ↔ /).
 */
export function GET(request) {
  const res = NextResponse.redirect(new URL("/auth", request.url));
  res.cookies.delete("vp_session");
  return res;
}
