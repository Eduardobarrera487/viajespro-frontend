import { NextResponse } from "next/server";

const SESSION_COOKIE = "vp_session";
const ADMIN_PATHS = ["/admin", "/vendedor/admin"];

function parseSessionCookie(rawValue) {
  if (!rawValue) return null;

  const candidates = [rawValue];

  try {
    candidates.push(decodeURIComponent(rawValue));
  } catch {
    // Si no se puede decodificar, seguimos con el valor original.
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Intentar siguiente variante.
    }
  }

  return null;
}

function hasAdminRole(usuario) {
  if (!usuario) return false;

  const roleName = String(usuario.Rol ?? usuario.rol ?? usuario.role ?? usuario.Role ?? "")
    .trim()
    .toLowerCase();

  if (["admin", "administrador", "administrator"].includes(roleName)) {
    return true;
  }

  const rolId = Number(usuario.RolId ?? usuario.rolId ?? usuario.roleId);
  return Number.isFinite(rolId) && rolId === 1;
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const rawSession = request.cookies.get(SESSION_COOKIE)?.value;
  const hasSession = Boolean(rawSession);
  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");
  const isAdminRoute = ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!hasSession && !isAuthRoute) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (hasSession && isAdminRoute) {
    const session = parseSessionCookie(rawSession);

    if (!hasAdminRole(session?.usuario)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
