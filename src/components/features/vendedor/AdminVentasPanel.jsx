import { MisViajesPanel } from "@/components/features/vendedor/MisViajesPanel";

export function AdminVentasPanel({ viajes = [] }) {
  const activos = viajes.filter((v) => Boolean(v.activo ?? v.Activo)).length;
  const pausados = viajes.length - activos;

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Publicaciones</p>
          <p className="mt-2 text-4xl font-black text-slate-950">{viajes.length}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Activas</p>
          <p className="mt-2 text-4xl font-black text-emerald-600">{activos}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Pausadas</p>
          <p className="mt-2 text-4xl font-black text-slate-500">{pausados}</p>
        </div>
      </div>

      <MisViajesPanel viajes={viajes} admin />
    </section>
  );
}
