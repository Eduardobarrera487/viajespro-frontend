import { cambiarEstadoUsuarioAction, cambiarRolUsuarioAction } from "@/lib/admin/actions";

export function AdminUsuariosPanel({ usuarios = [], roles = [] }) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Usuario</th>
              <th className="px-5 py-4">Rol</th>
              <th className="px-5 py-4">Reservas</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((u) => {
              const id = u.usuarioId ?? u.UsuarioId;
              const activo = Boolean(u.activo ?? u.Activo);
              const rolId = u.rolId ?? u.RolId;

              return (
                <tr key={id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{u.nombre ?? u.Nombre}</p>
                    <p className="text-slate-500">{u.email ?? u.Email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <form action={cambiarRolUsuarioAction} className="flex items-center gap-2">
                      <input type="hidden" name="usuarioId" value={id} />
                      <select name="rolId" defaultValue={rolId} className="rounded-xl border border-slate-200 px-3 py-2">
                        {roles.map((r) => (
                          <option key={r.rolId ?? r.RolId} value={r.rolId ?? r.RolId}>
                            {r.nombre ?? r.Nombre}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-xl bg-slate-900 px-3 py-2 font-bold text-white">Guardar</button>
                    </form>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700">{u.reservas ?? u.Reservas ?? 0}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${activo ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <form action={cambiarEstadoUsuarioAction}>
                      <input type="hidden" name="usuarioId" value={id} />
                      <input type="hidden" name="activo" value={(!activo).toString()} />
                      <button className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50">
                        {activo ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
