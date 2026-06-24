"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MainNav } from "@/components/layout/MainNav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Abrir menú"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50"
      >
        <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
      </button>

      {open ? (
        <div className="absolute left-4 right-4 top-[74px] z-50 rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
          <MainNav compact />
        </div>
      ) : null}
    </div>
  );
}
