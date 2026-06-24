import { cambiarEstadoReservaAdminAction } from "@/lib/admin/actions";
import { formatCurrency, formatDate } from "@/lib/format";

export function AdminReservasPanel({ reservas = [], estados = [] }) {
  return (
    <div className="space-y-4">
      {reservas.map((r) => {
        const id = r.reservaId ?? r.ReservaId;
        const estadoId = r.estadoReservaId ?? r.EstadoReservaId;
        const viaje = r.viaje ?? r.Viaje;
        const usuario = r.usuario ?? r.Usuario;

        return (
          <article key={id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">VP-{String(id).padStart(4, "0")}</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{viaje?.titulo ?? viaje?.Titulo ?? "Viaje"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {usuario?.nombre ?? usuario?.Nombre ?? "Usuario"} · {usuario?.email ?? usuario?.Email ?? ""}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Salida: {formatDate(viaje?.fecha ?? viaje?.Fecha) ?? "—"} · Personas: {r.cantidadPersonas ?? r.CantidadPersonas}
                </p>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[360px]">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-500">Total</p><p className="font-black">{formatCurrency(r.total ?? r.Total ?? 0)}</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-500">Pagado</p><p className="font-black">{formatCurrency(r.totalPagado ?? r.TotalPagado ?? 0)}</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-500">Estado</p><p className="font-black">{r.estado ?? r.Estado ?? "—"}</p></div>
              </div>
            </div>

            <form action={cambiarEstadoReservaAdminAction} className="mt-5 grid gap-3 md:grid-cols-[220px_1fr_auto]">
              <input type="hidden" name="reservaId" value={id} />
              <select name="estadoReservaId" defaultValue={estadoId} className="rounded-xl border border-slate-200 px-3 py-2">
                {estados.map((e) => (
                  <option key={e.estadoReservaId ?? e.EstadoReservaId} value={e.estadoReservaId ?? e.EstadoReservaId}>
                    {e.nombre ?? e.Nombre}
                  </option>
                ))}
              </select>
              <input name="motivo" placeholder="Motivo del cambio" className="rounded-xl border border-slate-200 px-3 py-2" />
              <button className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white">Actualizar</button>
            </form>
          </article>
        );
      })}
    </div>
  );
}
