"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateRange } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import {
  CalendarIcon,
  MinusIcon,
  PlusIcon,
  BoltIcon,
  ArrowRightIcon,
} from "@/components/features/viajes/icons";

const LOW_STOCK_THRESHOLD = 5;

/**
 * Tarjeta de reserva (sidebar). Interactiva: selección de fecha y nº de viajeros,
 * con cálculo de subtotal/impuestos/total en vivo.
 *
 * @param {{
 *   viajeId: number,
 *   precio: number,
 *   disponibilidades: Array<{
 *     disponibilidadId: number, fecha: string, fechaRetorno: string,
 *     cuposDisponibles: number, cuposTotales: number, activo: boolean
 *   }>
 * }} props
 */
export function BookingCard({ viajeId, precio, disponibilidades }) {
  const router = useRouter();
  // Solo fechas activas con cupo disponible.
  const opciones = useMemo(
    () => disponibilidades.filter((d) => d.activo && d.cuposDisponibles > 0),
    [disponibilidades],
  );

  const [selectedId, setSelectedId] = useState(opciones[0]?.disponibilidadId ?? null);
  const [viajeros, setViajeros] = useState(opciones.length ? Math.min(2, opciones[0].cuposDisponibles) : 1);

  const seleccion = opciones.find((d) => d.disponibilidadId === selectedId) ?? null;
  const maxViajeros = seleccion?.cuposDisponibles ?? 1;

  const { subtotal, impuestos, total } = computeTotals(precio, viajeros);

  function cambiarFecha(id) {
    const nueva = opciones.find((d) => d.disponibilidadId === id);
    setSelectedId(id);
    if (nueva && viajeros > nueva.cuposDisponibles) setViajeros(nueva.cuposDisponibles);
  }

  const disponible = Boolean(seleccion);

  function irAReservar() {
    if (!disponible) return;
    const query = new URLSearchParams({
      disp: String(selectedId),
      viajeros: String(viajeros),
    });
    router.push(`/viajes/${viajeId}/reservar?${query}`);
  }

  return (
    <aside className="rounded-3xl bg-white p-6 shadow-card sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-3xl font-bold text-slate-950">
          {formatCurrency(precio)}
          <span className="ml-1 text-sm font-medium text-slate-500">/persona</span>
        </p>
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          Mejor precio
        </span>
      </div>

      {/* Fechas */}
      <div className="mt-6">
        <label htmlFor="fecha" className="text-sm font-medium text-slate-700">
          Fechas
        </label>
        <div className="relative mt-1.5">
          <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          {disponible ? (
            <select
              id="fecha"
              value={selectedId}
              onChange={(e) => cambiarFecha(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-sm font-medium text-slate-900 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {opciones.map((d) => (
                <option key={d.disponibilidadId} value={d.disponibilidadId}>
                  {formatDateRange(d.fecha, d.fechaRetorno)}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-400">
              Sin fechas disponibles
            </div>
          )}
        </div>
      </div>

      {/* Viajeros */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">Viajeros</p>
        <div className="mt-1.5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="text-sm font-medium text-slate-900">
            {viajeros} {viajeros === 1 ? "Adulto" : "Adultos"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViajeros((v) => Math.max(1, v - 1))}
              disabled={!disponible || viajeros <= 1}
              aria-label="Quitar viajero"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-slate-900">{viajeros}</span>
            <button
              type="button"
              onClick={() => setViajeros((v) => Math.min(maxViajeros, v + 1))}
              disabled={!disponible || viajeros >= maxViajeros}
              aria-label="Añadir viajero"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Aviso de pocos cupos */}
      {disponible && seleccion.cuposDisponibles <= LOW_STOCK_THRESHOLD ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-brand-50 px-3.5 py-3 text-sm text-brand-800">
          <BoltIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <p>
            <span className="font-semibold">¡Últimos {seleccion.cuposDisponibles} cupos!</span>{" "}
            Reserva pronto para asegurar tu lugar en estas fechas.
          </p>
        </div>
      ) : null}

      {/* Desglose */}
      <dl className="mt-6 space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>
            {formatCurrency(precio)} × {viajeros} {viajeros === 1 ? "adulto" : "adultos"}
          </dt>
          <dd className="font-medium text-slate-900">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-slate-600">
          <dt>Impuestos y tasas (est.)</dt>
          <dd className="font-medium text-slate-900">{formatCurrency(impuestos)}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base">
          <dt className="font-semibold text-slate-950">Total</dt>
          <dd className="font-bold text-slate-950">{formatCurrency(total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={irAReservar}
        disabled={!disponible}
        className="btn btn-primary mt-5 w-full gap-2"
      >
        Reservar ahora
        <ArrowRightIcon className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">No se te cobrará nada aún</p>
    </aside>
  );
}
