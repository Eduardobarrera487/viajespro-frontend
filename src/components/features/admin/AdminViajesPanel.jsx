import Link from "next/link";

import { cambiarEstadoViajeAdminAction } from "@/lib/admin/actions";
import { formatCurrency } from "@/lib/format";

export function AdminViajesPanel({ viajes = [] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {viajes.map((v) => {
        const id = v.viajeId ?? v.ViajeId;
        const activo = Boolean(v.activo ?? v.Activo);
        const imagen = v.imagenUrl ?? v.ImagenUrl;

        return (
          <article key={id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {imagen ? <img src={imagen} alt="" className="h-48 w-full object-cover" /> : <div className="h-48 bg-slate-100" />}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-blue-600">{v.ciudad ?? v.Ciudad ?? "Ciudad"}, {v.pais ?? v.Pais ?? "País"}</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">{v.titulo ?? v.Titulo}</h2>
                  <p className="mt-1 text-sm text-slate-500">Publicado por {v.publicadoPor?.nombre ?? v.PublicadoPor?.Nombre ?? "—"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${activo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {activo ? "Activo" : "Pausado"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-3 text-sm">
                <div><p className="text-slate-500">Precio</p><p className="font-black">{formatCurrency(v.precio ?? v.Precio ?? 0)}</p></div>
                <div><p className="text-slate-500">Reservas</p><p className="font-black">{v.reservas ?? v.Reservas ?? 0}</p></div>
                <div><p className="text-slate-500">Likes</p><p className="font-black">♥ {v.likes ?? v.Likes ?? 0}</p></div>
                <div><p className="text-slate-500">Shares</p><p className="font-black">{v.compartidos ?? v.Compartidos ?? 0}</p></div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/viajes/${id}`} className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50">
                  Ver
                </Link>
                <form action={cambiarEstadoViajeAdminAction}>
                  <input type="hidden" name="viajeId" value={id} />
                  <input type="hidden" name="activo" value={(!activo).toString()} />
                  <button className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
                    {activo ? "Pausar" : "Publicar"}
                  </button>
                </form>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
