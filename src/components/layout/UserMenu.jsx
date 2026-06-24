"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";

function initials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

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

export function UserMenu({ nombre, usuario }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const admin = isAdminUser(usuario);

  useEffect(() => {
    if (!open) return;

    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }

    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full p-1.5 pr-2 transition-colors hover:bg-slate-50 sm:pr-3"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {initials(nombre)}
        </span>

        <span className="hidden text-left leading-tight sm:block">
          <span className="block max-w-40 truncate text-sm font-bold text-slate-950">{nombre}</span>
          <span className="block text-xs text-slate-500">Mi cuenta</span>
        </span>

        <span className="text-slate-400">⌄</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-slate-950">{nombre}</p>
            <p className="text-xs text-slate-500">{admin ? "Administrador" : "Usuario"}</p>
          </div>

          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Mi perfil
          </Link>

          <Link
            href="/reservas"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Mis reservas
          </Link>

          <Link
            href="/likes"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Guardados
          </Link>

          {admin ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Panel admin
            </Link>
          ) : null}

          <form action={logoutAction} className="border-t border-slate-100">
            <button
              type="submit"
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
