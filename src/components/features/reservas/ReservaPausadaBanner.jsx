"use client";

import { useActionState } from "react";
import Link from "next/link";
import { solicitarReembolsoAction } from "@/lib/reservas/actions";

/**
 * Punto #3 — aviso cuando el viaje de una reserva fue pausado. El cliente elige
 * reagendar (va al detalle a tomar otra fecha) o solicitar reembolso.
 *
 * @param {{ reservaId: number, viajeId?: number | null }} props
 */
export function ReservaPausadaBanner({ reservaId, viajeId }) {
  const [state, formAction, pending] = useActionState(solicitarReembolsoAction, { ok: false, error: null });

  return (
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-bold text-amber-800">⏸ Este viaje fue pausado</p>
      <p className="mt-1 text-sm text-amber-700">
        El agente pausó este viaje. Puedes reagendarlo a otra fecha o solicitar la devolución de tu dinero.
      </p>

      {state.ok ? (
        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-emerald-700">
          ✓ Reembolso solicitado. Te contactaremos con los detalles.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {viajeId ? (
            <Link
              href={`/viajes/${viajeId}`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-700"
            >
              Reagendar
            </Link>
          ) : null}
          <form action={formAction}>
            <input type="hidden" name="reservaId" value={reservaId} />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-amber-300 bg-white px-4 text-sm font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
            >
              {pending ? "Enviando…" : "Solicitar reembolso"}
            </button>
          </form>
        </div>
      )}

      {state.error ? <p className="mt-2 text-sm font-medium text-red-600">{state.error}</p> : null}
    </div>
  );
}
