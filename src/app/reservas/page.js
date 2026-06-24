import { redirect } from "next/navigation";

import { getMisReservas } from "@/lib/api/reservas";
import { getSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ReservasTabs } from "@/components/features/reservas/ReservasTabs";

export const metadata = {
  title: "Mis reservas · ViajesPro",
};

/** Clasifica una reserva en próxima / pasada / cancelada. */
function categorizar(reserva, hoy) {
  if ((reserva.estado || "").toLowerCase() === "cancelada") return "cancelada";
  const fecha = reserva.disponibilidad?.fecha ? new Date(reserva.disponibilidad.fecha) : null;
  if (fecha && fecha.getTime() < hoy.getTime()) return "pasada";
  return "proxima";
}

export default async function ReservasPage() {
  // Doble verificación: el middleware ya bloquea sin sesión, pero re-validamos aquí.
  const session = await getSession();
  if (!session?.token) redirect("/logout");

  const res = await getMisReservas();
  if (res.status === 401) redirect("/logout");
  if (!res.ok) throw new Error("No se pudieron cargar tus reservas desde la API.");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const reservas = (Array.isArray(res.data) ? res.data : []).map((r) => ({
    reservaId: r.reservaId,
    estado: r.estado ?? "—",
    categoria: categorizar(r, hoy),
    viajeId: r.disponibilidad?.viaje?.viajeId ?? null,
    titulo: r.disponibilidad?.viaje?.titulo ?? "Viaje",
    fecha: r.disponibilidad?.fecha ?? null,
    cantidadPersonas: r.cantidadPersonas ?? 1,
    total: r.total ?? Number(r.precioUnitario ?? 0) * (r.cantidadPersonas ?? 1),
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Mis reservas</h1>
          <p className="mt-2 text-sm text-slate-500">
            Gestiona tus próximos viajes y revisa tu historial.
          </p>
        </header>

        <ReservasTabs reservas={reservas} />
      </main>

      <SiteFooter />
    </div>
  );
}
