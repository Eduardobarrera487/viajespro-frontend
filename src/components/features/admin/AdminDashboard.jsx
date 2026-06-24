import Link from "next/link";

import { formatCurrency } from "@/lib/format";

function Stat({ label, value, href }) {
  const body = (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

export function AdminDashboard({ data = {} }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Usuarios" value={data.totalUsuarios ?? 0} href="/admin/usuarios" />
        <Stat label="Viajes activos" value={data.viajesActivos ?? 0} href="/admin/viajes" />
        <Stat label="Reservas" value={data.totalReservas ?? 0} href="/admin/reservas" />
        <Stat label="Quejas pendientes" value={data.quejasPendientes ?? 0} href="/admin/quejas" />
        <Stat label="Ingresos pagados" value={formatCurrency(data.totalPagado ?? 0)} />
        <Stat label="Likes" value={data.totalLikes ?? 0} href="/likes" />
        <Stat label="Compartidos" value={data.totalCompartidos ?? 0} />
        <Stat label="Reservas pendientes" value={data.reservasPendientes ?? 0} href="/admin/reservas" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Últimas reservas</h2>
          <div className="mt-5 space-y-3">
            {(data.ultimasReservas ?? []).map((r) => (
              <div key={r.reservaId ?? r.ReservaId} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold text-slate-950">VP-{String(r.reservaId ?? r.ReservaId).padStart(4, "0")}</p>
                  <p className="font-black text-slate-950">{formatCurrency(r.total ?? r.Total ?? 0)}</p>
                </div>
                <p className="mt-1 text-sm text-slate-500">{r.usuario ?? r.Usuario ?? "Usuario"} · {r.viaje ?? r.Viaje ?? "Viaje"}</p>
              </div>
            ))}
            {!(data.ultimasReservas ?? []).length ? <p className="text-slate-500">Sin reservas todavía.</p> : null}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Viajes más gustados</h2>
          <div className="mt-5 space-y-3">
            {(data.viajesMasGustados ?? []).map((v) => (
              <div key={v.viajeId ?? v.ViajeId} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="font-bold text-slate-950">{v.titulo ?? v.Titulo}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(v.precio ?? v.Precio ?? 0)}</p>
                </div>
                <p className="text-lg font-black text-red-600">♥ {v.likes ?? v.Likes ?? 0}</p>
              </div>
            ))}
            {!(data.viajesMasGustados ?? []).length ? <p className="text-slate-500">Sin likes todavía.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
