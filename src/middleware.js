import { NextResponse } from "next/server";

const SESSION_COOKIE = "vp_session";

/**
 * Toda la app es privada salvo `/auth`. Sin la cookie `vp_session`, cualquier
 * ruta redirige a /auth (recordando a dónde volver con `next`). La verificación
 * real del JWT se hace además en cada Server Component / Server Action.
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");

  // Ruta privada sin sesión → login, recordando a dónde volver.
  if (!hasSession && !isAuthRoute) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // Ya logueado entrando a /auth → home.
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
