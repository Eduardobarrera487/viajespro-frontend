"use client";

import { useMemo, useState } from "react";
import { ReservaCard, refReserva } from "@/components/features/reservas/ReservaCard";

const TABS = [
  { id: "proxima", label: "Próximas" },
  { id: "pasada", label: "Pasadas" },
  { id: "cancelada", label: "Canceladas" },
];

/**
 * Tabs del historial de reservas (Próximas / Pasadas / Canceladas) con búsqueda.
 * Recibe las reservas del usuario ya categorizadas desde el Server Component.
 *
 * @param {{ reservas: Array<{
 *   reservaId: number, estado: string, categoria: string, viajeId?: number,
 *   titulo: string, fecha?: string, cantidadPersonas: number, total: number
 * }> }} props
 */
export function ReservasTabs({ reservas }) {
  const [tab, setTab] = useState("proxima");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { proxima: 0, pasada: 0, cancelada: 0 };
    for (const r of reservas) if (c[r.categoria] !== undefined) c[r.categoria] += 1;
    return c;
  }, [reservas]);

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservas
      .filter((r) => r.categoria === tab)
      .filter((r) =>
        !q ||
        r.titulo?.toLowerCase().includes(q) ||
        refReserva(r.reservaId).toLowerCase().includes(q),
      );
  }, [reservas, tab, query]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div role="tablist" className="inline-flex gap-1 rounded-xl bg-slate-100 p-1">
          {TABS.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
                <span className={active ? "ml-1.5 text-white/80" : "ml-1.5 text-slate-400"}>
                  {counts[id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda */}
        <div className="relative sm:w-72">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por destino o ID (ej. VP-0001)"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      {/* Lista */}
      {visibles.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((r) => (
            <ReservaCard key={r.reservaId} reserva={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab }) {
  const msg = {
    proxima: "No tienes viajes próximos. ¡Explora destinos y reserva tu próxima aventura!",
    pasada: "Aún no tienes viajes pasados.",
    cancelada: "No tienes reservas canceladas.",
  };
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <h2 className="text-lg font-semibold text-slate-900">Sin reservas</h2>
      <p className="mt-2 text-sm text-slate-500">{msg[tab]}</p>
    </div>
  );
}
