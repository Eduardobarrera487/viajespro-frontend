import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { hasAdminRole } from "@/lib/auth/roles";
import { MainNav } from "@/components/layout/MainNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { PlaneLogoIcon, BellIcon } from "@/components/features/viajes/icons";

export async function SiteHeader() {
  const session = await getSession();
  const usuario = session?.usuario;
  const isAdmin = hasAdminRole(usuario);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-bold text-slate-950">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <PlaneLogoIcon className="h-6 w-6" />
            </span>
            <span className="text-lg sm:text-xl">ViajesPro</span>
          </Link>

          {usuario ? <MainNav usuario={usuario} /> : null}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {usuario ? (
            <>
              <Link
                href="/quejas"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 md:inline-flex"
              >
                Soporte
              </Link>

              {isAdmin ? (
                <Link
                  href="/admin"
                  className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 md:inline-flex"
                >
                  Admin
                </Link>
              ) : null}

              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 sm:flex"
                aria-label="Notificaciones"
              >
                <BellIcon className="h-5 w-5" />
              </button>

              <UserMenu nombre={usuario.Nombre ?? usuario.nombre} usuario={usuario} />
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
