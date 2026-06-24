"use client";

import { useMemo, useState } from "react";

import { ReservaCard } from "@/components/features/reservas/ReservaCard";

const TABS = [
  { id: "proxima", label: "Próximas" },
  { id: "pasada", label: "Pasadas" },
  { id: "cancelada", label: "Canceladas" },
];

function normalize(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function ReservasTabs({ reservas = [] }) {
  const [activeTab, setActiveTab] = useState("proxima");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    return reservas.reduce(
      (acc, reserva) => {
        acc[reserva.categoria] = (acc[reserva.categoria] || 0) + 1;
        return acc;
      },
      { proxima: 0, pasada: 0, cancelada: 0 },
    );
  }, [reservas]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    return reservas.filter((reserva) => {
      if (reserva.categoria !== activeTab) return false;
      if (!q) return true;

      return [
        reserva.titulo,
        reserva.destino,
        reserva.estado,
        reserva.reservaId,
        `VP-${String(reserva.reservaId || 0).padStart(4, "0")}`,
      ]
        .map(normalize)
        .some((value) => value.includes(q));
    });
  }, [activeTab, query, reservas]);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 overflow-x-auto rounded-3xl bg-slate-100 p-1 lg:w-auto">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                }`}
              >
                {tab.label} <span className={active ? "text-blue-100" : "text-slate-400"}>{counts[tab.id] || 0}</span>
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:max-w-sm">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por destino o ID"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {filtered.map((reserva) => (
            <ReservaCard key={reserva.reservaId} reserva={reserva} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-2xl font-black text-slate-950">No hay reservas aquí</h2>
          <p className="mt-2 text-slate-600">Probá cambiar el filtro o buscar otro ID.</p>
        </div>
      )}
    </div>
  );
}
