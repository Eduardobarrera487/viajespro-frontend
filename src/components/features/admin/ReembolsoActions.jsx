"use client";

import { useActionState } from "react";
import { resolverReembolsoAction } from "@/lib/reembolsos/actions";

const initialState = { ok: false, error: null };

/**
 * Acciones para resolver una solicitud de reembolso (Aprobar/Rechazar/Procesar),
 * con feedback inline suave (no rojo brusco).
 *
 * @param {{ id: number, estado: string, montoSolicitado: number, montoAprobado?: number|null }} props
 */
export function ReembolsoActions({ id, estado, montoSolicitado, montoAprobado }) {
  const [state, formAction, pending] = useActionState(resolverReembolsoAction, initialState);
  const e = String(estado || "").toLowerCase();

  return (
    <div className="mt-5 space-y-3">
      {e === "pendiente" ? (
        <>
          <form action={formAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="solicitudId" value={id} />
            <input type="hidden" name="estado" value="Aprobada" />
            <label className="text-sm text-slate-600">
              Aprobar
              <input
                name="montoAprobado"
                type="number"
                step="0.01"
                min="0.01"
                max={montoSolicitado}
                defaultValue={montoSolicitado}
                disabled={pending}
                className="ml-2 w-28 rounded-xl border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-emerald-400 disabled:opacity-60"
              />
            </label>
            <button type="submit" disabled={pending} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {pending ? "…" : "Aprobar"}
            </button>
          </form>
          <form action={formAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="solicitudId" value={id} />
            <input type="hidden" name="estado" value="Rechazada" />
            <input
              name="observacion"
              type="text"
              placeholder="Motivo del rechazo"
              disabled={pending}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 disabled:opacity-60"
            />
            <button type="submit" disabled={pending} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
              {pending ? "…" : "Rechazar"}
            </button>
          </form>
        </>
      ) : e === "aprobada" ? (
        <form action={formAction}>
          <input type="hidden" name="solicitudId" value={id} />
          <input type="hidden" name="estado" value="Procesada" />
          <input type="hidden" name="montoAprobado" value={montoAprobado ?? montoSolicitado} />
          <button type="submit" disabled={pending} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60">
            {pending ? "Procesando…" : "Marcar como procesada (devolución hecha)"}
          </button>
        </form>
      ) : null}

      {/* Feedback suave */}
      {state.error ? (
        <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <span aria-hidden>ⓘ</span>
          <span>{state.error}</span>
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          ✓ Solicitud actualizada.
        </p>
      ) : null}
    </div>
  );
}
