export function MisQuejasPanel({ quejas = [] }) {
  if (!quejas.length) {
    return <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Todavía no has enviado quejas.</div>;
  }

  return (
    <div className="space-y-4">
      {quejas.map((q) => (
        <article key={q.quejaId ?? q.QuejaId} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{q.estado ?? q.Estado}</span>
              <h2 className="mt-3 text-xl font-black text-slate-950">{q.asunto ?? q.Asunto}</h2>
            </div>
            <p className="text-sm font-bold text-slate-400">#{q.quejaId ?? q.QuejaId}</p>
          </div>
          <p className="mt-3 text-slate-600">{q.descripcion ?? q.Descripcion}</p>
          {(q.respuestaAdmin ?? q.RespuestaAdmin) ? (
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
              <strong>Respuesta:</strong> {q.respuestaAdmin ?? q.RespuestaAdmin}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
