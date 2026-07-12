import { ReembolsoActions } from "@/components/features/admin/ReembolsoActions";

function pick(...values) {
  return values.find((v) => v !== undefined && v !== null && v !== "");
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function tone(estado) {
  const e = String(estado || "").toLowerCase();
  if (e === "aprobada") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (e === "rechazada") return "bg-red-50 text-red-700 ring-red-100";
  if (e === "procesada") return "bg-blue-50 text-blue-700 ring-blue-100";
  return "bg-amber-50 text-amber-700 ring-amber-100"; // Pendiente
}

/**
 * Panel de admin para resolver solicitudes de reembolso (punto #3).
 * @param {{ solicitudes: Array<object> }} props
 */
export function AdminReembolsosPanel({ solicitudes = [] }) {
  if (solicitudes.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-black text-slate-950">No hay solicitudes de reembolso</h2>
        <p className="mt-2 text-slate-600">Cuando un cliente solicite un reembolso, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {solicitudes.map((s, i) => {
        const id = pick(s.solicitudReembolsoId, s.SolicitudReembolsoId, s.id, i);
        const estado = String(pick(s.estado, s.Estado, "Pendiente"));
        const estadoLower = estado.toLowerCase();
        const usuario = pick(s.usuario?.nombre, s.Usuario?.Nombre, "—");
        const email = pick(s.usuario?.email, s.Usuario?.Email, "");
        const reserva = pick(s.reserva, s.Reserva, {});
        const viaje = pick(reserva?.disponibilidad?.viaje, reserva?.Disponibilidad?.Viaje, {});
        const titulo = pick(viaje?.titulo, viaje?.Titulo, `Reserva #${pick(s.reservaId, s.ReservaId, "")}`);
        const motivo = pick(s.motivo, s.Motivo, "Sin motivo indicado.");
        const montoSolicitado = Number(pick(s.montoSolicitado, s.MontoSolicitado, reserva?.total, reserva?.Total, 0));
        const montoAprobado = pick(s.montoAprobado, s.MontoAprobado);
        const observacion = pick(s.observacionResolucion, s.ObservacionResolucion);

        return (
          <article key={id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-xl font-black text-slate-950">{titulo}</h3>
                <p className="text-sm text-slate-500">{usuario}{email ? ` · ${email}` : ""}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ring-1 ${tone(estado)}`}>{estado}</span>
            </div>

            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Motivo:</span> {motivo}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-slate-500">Monto solicitado</dt><dd className="font-black text-slate-950">{money(montoSolicitado)}</dd></div>
              {montoAprobado != null ? (
                <div><dt className="text-slate-500">Monto aprobado</dt><dd className="font-black text-emerald-700">{money(montoAprobado)}</dd></div>
              ) : null}
            </dl>

            {observacion ? (
              <p className="mt-2 text-xs text-slate-500"><span className="font-semibold">Observación:</span> {observacion}</p>
            ) : null}

            {/* Acciones + feedback inline suave (client) */}
            {estadoLower === "pendiente" || estadoLower === "aprobada" ? (
              <ReembolsoActions
                id={id}
                estado={estado}
                montoSolicitado={montoSolicitado}
                montoAprobado={montoAprobado != null ? Number(montoAprobado) : null}
              />
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
