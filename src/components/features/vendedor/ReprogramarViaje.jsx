"use client";

import { useActionState, useState } from "react";
import { reprogramarViajeAction } from "@/lib/publicaciones/actions";

const initialState = { ok: false, error: null };

/** yyyy-mm-dd a partir de una fecha ISO del API (para <input type=date>). */
function toDateInput(value) {
  return value ? String(value).slice(0, 10) : "";
}

/**
 * Para un viaje PAUSADO: elige una fecha nueva y lo reactiva ("reprogramar").
 *
 * @param {{
 *   viajeId: number, disponibilidadId: number, cuposTotales: number,
 *   fecha?: string, fechaRetorno?: string
 * }} props
 */
export function ReprogramarViaje({ viajeId, disponibilidadId, cuposTotales, fecha, fechaRetorno }) {
  const [state, formAction, pending] = useActionState(reprogramarViajeAction, initialState);
  const [abierto, setAbierto] = useState(false);
  const hoy = new Date().toISOString().slice(0, 10);

  if (!disponibilidadId) {
    // Sin disponibilidad no podemos reprogramar; solo reactivar (fallback).
    return null;
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="rounded-2xl bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
      >
        Reprogramar y publicar
      </button>
    );
  }

  return (
    <form action={formAction} className="w-full space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <input type="hidden" name="viajeId" value={viajeId} />
      <input type="hidden" name="disponibilidadId" value={disponibilidadId} />
      <input type="hidden" name="cuposTotales" value={cuposTotales} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Nueva salida
          <input
            name="fecha"
            type="date"
            min={hoy}
            defaultValue={toDateInput(fecha)}
            required
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Nuevo retorno
          <input
            name="fechaRetorno"
            type="date"
            min={hoy}
            defaultValue={toDateInput(fechaRetorno)}
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Publicando…" : "Reprogramar y publicar"}
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
        >
          Cancelar
        </button>
      </div>

      {state.error ? (
        <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <span aria-hidden>ⓘ</span>
          <span>{state.error}</span>
        </p>
      ) : null}
    </form>
  );
}
