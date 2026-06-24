export function AdminRolesPanel({ roles = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {roles.map((rol) => (
        <article key={rol.rolId ?? rol.RolId} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">{rol.nombre ?? rol.Nombre}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Usuarios</p>
              <p className="mt-1 text-3xl font-black text-slate-950">{rol.usuarios ?? rol.Usuarios ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Permisos</p>
              <p className="mt-1 text-3xl font-black text-slate-950">{rol.permisos ?? rol.Permisos ?? 0}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
