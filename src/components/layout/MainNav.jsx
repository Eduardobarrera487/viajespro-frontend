"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isAdminUser(usuario) {
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

const BASE_LINKS = [
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
  {
    href: "/vendedor/publicar",
    label: "Vender viajes",
    isActive: (p) => p === "/vendedor/publicar" || p.startsWith("/vendedor/certificacion"),
  },
];

const MIS_VIAJES_LINK = {
  href: "/vendedor/mis-viajes",
  label: "Mis viajes",
  isActive: (p) => p.startsWith("/vendedor/mis-viajes"),
};

const ADMIN_LINK = {
  href: "/admin",
  label: "Panel admin",
  isActive: (p) => p.startsWith("/admin"),
};

export function MainNav({ usuario, esVendedor = false }) {
  const pathname = usePathname();
  const links = [...BASE_LINKS];
  if (esVendedor) links.push(MIS_VIAJES_LINK);
  if (isAdminUser(usuario)) links.push(ADMIN_LINK);

  return (
    <nav className="hidden items-center gap-2 lg:flex" aria-label="Navegación principal">
      {links.map((link) => {
        const active = link.isActive(pathname);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
