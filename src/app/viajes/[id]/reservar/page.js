import { notFound, redirect } from "next/navigation";

import { getViaje } from "@/lib/api/viajes";
import { getSession } from "@/lib/auth/session";
import { formatDateRange } from "@/lib/format";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CheckoutForm } from "@/components/features/reservas/CheckoutForm";

export const metadata = {
  title: "Reservar · ViajesPro",
};

export default async function ReservarPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;

  const viajeId = Number(id);
  if (!Number.isInteger(viajeId) || viajeId <= 0) notFound();

  const res = await getViaje(viajeId);
  if (res.status === 401) redirect("/logout");
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("No se pudo cargar el viaje desde la API.");

  const viaje = res.data;
  const session = await getSession();
  const usuario = session?.usuario ?? {};

  // Disponibilidad y viajeros vienen del paso anterior (detalle).
  const disponibilidades = viaje.disponibilidades ?? [];
  const dispId = Number(sp?.disp);
  const seleccion =
    disponibilidades.find((d) => d.disponibilidadId === dispId) ??
    disponibilidades.find((d) => d.activo) ??
    disponibilidades[0] ??
    null;

  const maxViajeros = Math.max(1, seleccion?.cuposDisponibles ?? 1);
  const viajeros = Math.min(Math.max(1, Number(sp?.viajeros) || 1), maxViajeros);

  const ubicacion = [
    viaje.destino?.ciudad?.nombre,
    viaje.destino?.ciudad?.pais?.nombre,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <CheckoutForm
        viajeId={viaje.viajeId}
        disponibilidadId={seleccion?.disponibilidadId ?? null}
        titulo={viaje.titulo}
        ubicacion={ubicacion}
        tipoNombre={viaje.tipoViaje?.nombre ?? "Paquete"}
        imageUrl={`https://picsum.photos/seed/viaje-${viaje.viajeId}-1/240/240`}
        precio={Number(viaje.precio)}
        viajeros={viajeros}
        fechaLabel={seleccion ? formatDateRange(seleccion.fecha, seleccion.fechaRetorno) : "Por confirmar"}
        usuario={{
          nombre: usuario.nombre ?? "",
          email: usuario.email ?? "",
          telefono: usuario.telefono ?? "",
        }}
      />
      <SiteFooter />
    </div>
  );
}
