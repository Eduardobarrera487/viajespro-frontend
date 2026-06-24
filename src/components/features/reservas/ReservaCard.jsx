import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";

/** Colores del badge según el estado de la reserva. */
function estadoTone(estado) {
  const e = (estado || "").toLowerCase();
  if (e === "confirmada") return "bg-green-100 text-green-700";
  if (e === "cancelada") return "bg-red-100 text-red-700";
  if (e === "pendiente") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

/** Código visible de la reserva, p.ej. VP-0042. */
export function refReserva(reservaId) {
  return `VP-${String(reservaId).padStart(4, "0")}`;
}

/**
 * Tarjeta de una reserva en el historial.
 *
 * @param {{ reserva: {
 *   reservaId: number, estado: string, viajeId?: number, titulo: string,
 *   fecha?: string, cantidadPersonas: number, total: number
 * } }} props
 */
export function ReservaCard({ reserva }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${estadoTone(reserva.estado)}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {reserva.estado || "—"}
        </span>
        <span className="text-xs font-medium text-slate-400">ID: {refReserva(reserva.reservaId)}</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/viaje-${reserva.viajeId ?? reserva.reservaId}-1/120/120`}
          alt={reserva.titulo}
          className="h-12 w-12 rounded-2xl object-cover"
        />
        <p className="font-semibold text-slate-950">{reserva.titulo}</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <dt className="text-slate-500">Salida</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{formatDate(reserva.fecha) ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Viajeros</dt>
          <dd className="mt-0.5 font-medium text-slate-900">
            {reserva.cantidadPersonas} {reserva.cantidadPersonas === 1 ? "Adulto" : "Adultos"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Total pagado</p>
          <p className="text-lg font-bold text-slate-950">{formatCurrency(reserva.total)}</p>
        </div>
        {reserva.viajeId ? (
          <Link href={`/viajes/${reserva.viajeId}`} className="btn btn-primary px-4">
            Ver detalle
          </Link>
        ) : null}
      </div>
    </div>
  );
}
