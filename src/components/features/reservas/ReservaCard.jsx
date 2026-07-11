import Link from "next/link";

import { ReservaCardActions } from "@/components/features/reservas/ReservaCardActions";
import { ReservaPausadaBanner } from "@/components/features/reservas/ReservaPausadaBanner";
import { formatCurrency, formatDate } from "@/lib/format";

function estadoTone(estado) {
  const e = (estado || "").toLowerCase();
  if (e === "confirmada") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (e === "cancelada") return "bg-red-50 text-red-700 ring-red-100";
  if (e === "pendiente") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-slate-50 text-slate-600 ring-slate-100";
}

export function refReserva(reservaId) {
  return `VP-${String(reservaId || 0).padStart(4, "0")}`;
}

export function ReservaCard({ reserva }) {
  const shareUrl = reserva.viajeId ? `/viajes/${reserva.viajeId}` : `/reservas`;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="p-5 sm:p-6">
        {reserva.pausada ? (
          <ReservaPausadaBanner reservaId={reserva.reservaId} viajeId={reserva.viajeId} />
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ring-1 ${estadoTone(reserva.estado)}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {reserva.estado || "—"}
          </span>
          <span className="shrink-0 text-sm font-bold text-slate-400">ID: {refReserva(reserva.reservaId)}</span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-slate-100 ring-1 ring-slate-100">
            {reserva.imagenUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={reserva.imagenUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">✈</div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-950 sm:text-2xl">{reserva.titulo}</h3>
            {reserva.destino ? <p className="mt-1 truncate text-sm font-medium text-slate-500">{reserva.destino}</p> : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 text-sm">
          <div>
            <p className="text-slate-500">Salida</p>
            <p className="mt-1 font-black text-slate-950">{formatDate(reserva.fecha) ?? "—"}</p>
          </div>
          <div>
            <p className="text-slate-500">Viajeros</p>
            <p className="mt-1 font-black text-slate-950">
              {reserva.cantidadPersonas} {reserva.cantidadPersonas === 1 ? "Adulto" : "Adultos"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total pagado</p>
            <p className="text-3xl font-black tracking-tight text-slate-950">{formatCurrency(reserva.total)}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <ReservaCardActions
              reservaId={reserva.reservaId}
              viajeId={reserva.viajeId}
              titulo={reserva.titulo}
              initialLiked={reserva.liked}
              shareUrl={shareUrl}
            />

            {reserva.viajeId ? (
              <Link
                href={`/viajes/${reserva.viajeId}`}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 sm:min-w-[138px]"
              >
                Ver detalle
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
