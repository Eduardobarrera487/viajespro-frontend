import { revisarCertificacionAction } from "@/lib/agentes/actions";

function pick(...values) {
  return values.find((v) => v !== undefined && v !== null && v !== "");
}

function tone(estado) {
  const e = String(estado || "").toLowerCase();
  if (e === "aprobada") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (e === "rechazada") return "bg-red-50 text-red-700 ring-red-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

/**
 * Panel de admin para revisar certificaciones de agentes (punto #1).
 * @param {{ certificaciones: Array<object> }} props
 */
export function AdminCertificacionesPanel({ certificaciones = [] }) {
  if (certificaciones.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-black text-slate-950">No hay solicitudes</h2>
        <p className="mt-2 text-slate-600">
          Cuando un vendedor solicite su certificación, aparecerá aquí para aprobar o rechazar.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          (Tip demo: agrega <code>?preview=1</code> a la URL para ver datos de ejemplo.)
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {certificaciones.map((c, i) => {
        const id = pick(c.agenteCertificacionId, c.AgenteCertificacionId, c.certificacionId, c.CertificacionId, c.id, i);
        const estado = pick(c.estado, c.Estado, "Pendiente");
        const nombreLegal = pick(c.nombreLegal, c.NombreLegal, c.razonSocial, c.RazonSocial, "—");
        const usuario = pick(c.usuario?.nombre, c.Usuario?.Nombre, c.usuarioNombre, c.UsuarioNombre, "—");
        const email = pick(c.usuario?.email, c.Usuario?.Email, c.email, c.Email, "");
        const cedula = pick(c.cedula, c.Cedula, "—");
        const licencia = pick(c.numeroLicencia, c.NumeroLicencia, "—");
        const docCedula = pick(c.documentoCedulaUrl, c.DocumentoCedulaUrl);
        const docLicencia = pick(c.documentoLicenciaUrl, c.DocumentoLicenciaUrl);
        const pendiente = String(estado).toLowerCase() === "pendiente";

        return (
          <article key={id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-950">{nombreLegal}</h3>
                <p className="text-sm text-slate-500">{usuario}{email ? ` · ${email}` : ""}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ring-1 ${tone(estado)}`}>{estado}</span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm">
              <div><dt className="text-slate-500">Cédula</dt><dd className="font-bold text-slate-950">{cedula}</dd></div>
              <div><dt className="text-slate-500">Licencia</dt><dd className="font-bold text-slate-950">{licencia}</dd></div>
            </dl>

            {(docCedula || docLicencia) ? (
              <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-blue-600">
                {docCedula ? <a href={docCedula} target="_blank" rel="noopener noreferrer" className="hover:underline">Ver cédula ↗</a> : null}
                {docLicencia ? <a href={docLicencia} target="_blank" rel="noopener noreferrer" className="hover:underline">Ver licencia ↗</a> : null}
              </div>
            ) : null}

            {pendiente ? (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <form action={revisarCertificacionAction} className="sm:flex-1">
                  <input type="hidden" name="certificacionId" value={id} />
                  <input type="hidden" name="estado" value="Aprobada" />
                  <button type="submit" className="w-full rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700">
                    Aprobar
                  </button>
                </form>
                <form action={revisarCertificacionAction} className="flex gap-2 sm:flex-1">
                  <input type="hidden" name="certificacionId" value={id} />
                  <input type="hidden" name="estado" value="Rechazada" />
                  <input name="motivo" type="text" placeholder="Motivo (opcional)"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-400" />
                  <button type="submit" className="shrink-0 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-50">
                    Rechazar
                  </button>
                </form>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
