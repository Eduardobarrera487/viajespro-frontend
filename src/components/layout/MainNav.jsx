"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    href: "/",
    label: "Exploración de Destinos",
    isActive: (p) => p === "/" || p.startsWith("/viajes"),
  },
  {
    href: "/reservas",
    label: "Historial de Reservas",
    isActive: (p) => p.startsWith("/reservas"),
  },
];

/** Pestañas principales del nav, con resaltado de la ruta activa. */
export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
      {LINKS.map((link) => {
        const active = link.isActive(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "text-brand-600 underline decoration-2 underline-offset-8"
                : "text-slate-600 transition-colors hover:text-slate-900"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
