"use client";

import { useState } from "react";
import { cambiarEstadoPublicacionAction } from "@/lib/publicaciones/actions";

/**
 * Botón para pausar/reactivar un viaje.
 * Al PAUSAR, el backend exige un motivo → mostramos un campo obligatorio.
 * Al REACTIVAR, no hace falta motivo.
 *
 * @param {{ viajeId: number, activo: boolean }} props
 */
export function ToggleEstadoViaje({ viajeId, activo }) {
  const [pausando, setPausando] = useState(false);

  // Reactivar (estaba pausado) — sin motivo.
  if (!activo) {
    return (
      <form action={cambiarEstadoPublicacionAction}>
        <input type="hidden" name="viajeId" value={viajeId} />
        <input type="hidden" name="activo" value="true" />
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800"
        >
          Publicar
        </button>
      </form>
    );
  }

  // Pausar — pide el motivo.
  if (!pausando) {
    return (
      <button
        type="button"
        onClick={() => setPausando(true)}
        className="rounded-2xl bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800"
      >
        Pausar
      </button>
    );
  }

  return (
    <form action={cambiarEstadoPublicacionAction} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <input type="hidden" name="viajeId" value={viajeId} />
      <input type="hidden" name="activo" value="false" />
      <input
        name="motivo"
        required
        maxLength={1000}
        placeholder="Motivo de la pausa (se le notifica al cliente)"
        className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
        >
          Confirmar pausa
        </button>
        <button
          type="button"
          onClick={() => setPausando(false)}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
