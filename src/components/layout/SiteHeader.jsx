import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { MainNav } from "@/components/layout/MainNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { PlaneLogoIcon, BellIcon } from "@/components/features/viajes/icons";

/**
 * Cabecera de la aplicación (logo, navegación y usuario).
 * Server Component: lee la sesión para mostrar el nombre del usuario.
 */
export async function SiteHeader() {
  const session = await getSession();
  const usuario = session?.usuario;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-card">
            <PlaneLogoIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">ViajesPro</span>
        </Link>

        <MainNav />

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:text-slate-900"
              >
                <span className="sr-only">Notificaciones</span>
                <BellIcon className="h-5 w-5" />
              </button>

              <UserMenu nombre={usuario.nombre} />
            </>
          ) : (
            <Link href="/auth" className="btn btn-primary px-4">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
