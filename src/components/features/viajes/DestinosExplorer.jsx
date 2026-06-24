"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { ViajeCard } from "@/components/features/viajes/ViajeCard";

const ORDENES = [
  { id: "recomendados", label: "Recomendados" },
  { id: "precio_asc", label: "Precio: menor a mayor" },
  { id: "precio_desc", label: "Precio: mayor a menor" },
];

/** Redondea hacia arriba al múltiplo de 100 más cercano (para el tope del slider). */
function techo(precioMax) {
  if (!precioMax) return 2500;
  return Math.ceil(precioMax / 100) * 100;
}

/**
 * Exploración de destinos con barra de filtros (búsqueda, precio, tipo) y orden.
 *
 * El API solo filtra por texto/tipo único, así que recibimos todos los viajes
 * activos y los filtros (precio, multi-tipo) se aplican en cliente.
 *
 * @param {{
 *   viajes: Array<{ viajeId: number, titulo: string, descripcion?: string, precio: number,
 *                   tipoViajeId: number, tipoViaje?: string, destino?: { ciudad?: string, pais?: string } }>,
 *   tipos: Array<{ tipoViajeId: number, nombre: string }>
 * }} props
 */
export function DestinosExplorer({ viajes, tipos }) {
  const maxPrecio = useMemo(
    () => techo(viajes.reduce((m, v) => Math.max(m, Number(v.precio) || 0), 0)),
    [viajes],
  );

  // Conteo de viajes por tipo (para los checkboxes).
  const conteoPorTipo = useMemo(() => {
    const c = {};
    for (const v of viajes) c[v.tipoViajeId] = (c[v.tipoViajeId] ?? 0) + 1;
    return c;
  }, [viajes]);

  const limpio = { q: "", maxPrice: maxPrecio, tipos: [] };
  const [draft, setDraft] = useState(limpio);
  const [applied, setApplied] = useState(limpio);
  const [orden, setOrden] = useState("recomendados");

  const resultados = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    let lista = viajes.filter((v) => {
      if (Number(v.precio) > applied.maxPrice) return false;
      if (applied.tipos.length && !applied.tipos.includes(v.tipoViajeId)) return false;
      if (q) {
        const texto = `${v.titulo} ${v.descripcion ?? ""} ${v.destino?.ciudad ?? ""} ${v.destino?.pais ?? ""}`.toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });

    if (orden === "precio_asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "precio_desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
    return lista;
  }, [viajes, applied, orden]);

  function toggleTipo(id) {
    setDraft((d) => ({
      ...d,
      tipos: d.tipos.includes(id) ? d.tipos.filter((t) => t !== id) : [...d.tipos, id],
    }));
  }

  function limpiar() {
    setDraft(limpio);
    setApplied(limpio);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
      {/* Sidebar de filtros */}
      <aside className="rounded-3xl bg-white p-5 shadow-card lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-950">Filtros</h2>
          <button
            type="button"
            onClick={limpiar}
            className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            Limpiar
          </button>
        </div>

        {/* Búsqueda */}
        <div className="mt-5">
          <label htmlFor="f-destino" className="text-sm font-medium text-slate-700">Destino</label>
          <input
            id="f-destino"
            type="search"
            value={draft.q}
            onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
            placeholder="¿A dónde quieres ir?"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        {/* Precio */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Precio (USD)</span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
              Hasta {formatCurrency(draft.maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrecio}
            step={50}
            value={draft.maxPrice}
            onChange={(e) => setDraft((d) => ({ ...d, maxPrice: Number(e.target.value) }))}
            className="mt-3 w-full accent-brand-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(maxPrecio)}</span>
          </div>
        </div>

        {/* Tipo de viaje */}
        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700">Tipo de viaje</span>
          <div className="mt-2 space-y-2">
            {tipos.length === 0 ? (
              <p className="text-xs text-slate-400">Sin tipos disponibles.</p>
            ) : (
              tipos.map((t) => (
                <label key={t.tipoViajeId} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.tipos.includes(t.tipoViajeId)}
                    onChange={() => toggleTipo(t.tipoViajeId)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-500/40"
                  />
                  <span>{t.nombre}</span>
                  <span className="text-slate-400">({conteoPorTipo[t.tipoViajeId] ?? 0})</span>
                </label>
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setApplied(draft)}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Aplicar filtros
        </button>
      </aside>

      {/* Resultados */}
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Destinos populares</h1>
            <p className="mt-1 text-sm text-slate-500">
              Mostrando {resultados.length} de {viajes.length} resultados
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Ordenar por:
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        {resultados.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Sin resultados</h3>
            <p className="mt-2 text-sm text-slate-500">Prueba ajustar los filtros o limpiarlos.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {resultados.map((viaje) => (
              <ViajeCard key={viaje.viajeId} viaje={viaje} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
