import { resolverQuejaAdminAction } from "@/lib/admin/actions";

const ESTADOS = ["Pendiente", "En revisión", "Resuelta", "Cerrada"];

export function AdminQuejasPanel({ quejas = [] }) {
  return (
    <div className="space-y-4">
      {quejas.map((q) => {
        const id = q.quejaId ?? q.QuejaId;
        const usuario = q.usuario ?? q.Usuario;
        const reserva = q.reserva ?? q.Reserva;
        const viaje = q.viaje ?? q.Viaje ?? reserva?.viaje ?? reserva?.Viaje;

        return (
          <article key={id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{q.estado ?? q.Estado}</span>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{q.asunto ?? q.Asunto}</h2>
                <p className="mt-2 text-slate-600">{q.descripcion ?? q.Descripcion}</p>
                <p className="mt-3 text-sm text-slate-500">
                  {usuario?.nombre ?? usuario?.Nombre ?? "Usuario"} · {usuario?.email ?? usuario?.Email ?? ""}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Tipo: {q.tipo ?? q.Tipo} · Reserva: {q.reservaId ?? q.ReservaId ?? "—"} · Viaje: {viaje?.titulo ?? viaje?.Titulo ?? "—"}
                </p>
                {(q.respuestaAdmin ?? q.RespuestaAdmin) ? (
                  <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                    <strong>Respuesta:</strong> {q.respuestaAdmin ?? q.RespuestaAdmin}
                  </div>
                ) : null}
              </div>
            </div>

            <form action={resolverQuejaAdminAction} className="mt-5 grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <input type="hidden" name="quejaId" value={id} />
              <select name="estado" defaultValue={q.estado ?? q.Estado} className="rounded-xl border border-slate-200 px-3 py-2">
                {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
              <input name="respuestaAdmin" placeholder="Respuesta administrativa" className="rounded-xl border border-slate-200 px-3 py-2" />
              <button className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white">Guardar</button>
            </form>
          </article>
        );
      })}
    </div>
  );
}
