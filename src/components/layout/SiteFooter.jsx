import Link from "next/link";
import { PlaneLogoIcon } from "@/components/features/viajes/icons";

/** Pie de página de la aplicación. */
export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-500">
          <PlaneLogoIcon className="h-4 w-4 text-brand-600" />
          <span>ViajesPro © 2024</span>
        </div>
        <nav className="flex items-center gap-6 text-slate-500">
          <Link href="#" className="transition-colors hover:text-slate-900">Términos</Link>
          <Link href="#" className="transition-colors hover:text-slate-900">Privacidad</Link>
          <Link href="#" className="transition-colors hover:text-slate-900">Soporte</Link>
        </nav>
      </div>
    </footer>
  );
}
