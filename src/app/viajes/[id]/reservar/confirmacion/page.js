import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getReserva } from "@/lib/api/reservas";
import { getSession } from "@/lib/auth/session";
import { formatCurrency, formatDateRange } from "@/lib/format";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Stepper } from "@/components/features/reservas/Stepper";
import { refReserva } from "@/components/features/reservas/ReservaCard";
import { CheckIcon, MapPinIcon } from "@/components/features/viajes/icons";

export const metadata = {
  title: "Reserva confirmada · ViajesPro",
};

export default async function ConfirmacionPage({ searchParams }) {
  const sp = await searchParams;
  const reservaId = Number(sp?.reserva);
  if (!Number.isInteger(reservaId) || reservaId <= 0) notFound();

  const res = await getReserva(reservaId);
  if (res.status === 401) redirect("/logout");
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("No se pudo cargar la reserva desde la API.");

  const reserva = res.data;
  const session = await getSession();
  const email = session?.usuario?.email;

  const viaje = reserva.disponibilidad?.viaje;
  const viajeId = viaje?.viajeId;
  const titulo = viaje?.titulo ?? "Tu viaje";
  const fechaLabel = reserva.disponibilidad
    ? formatDateRange(reserva.disponibilidad.fecha, reserva.disponibilidad.fechaRetorno)
    : "Por confirmar";
  const viajeros = reserva.cantidadPersonas ?? 1;
  const total = reserva.total ?? Number(reserva.precioUnitario ?? 0) * viajeros;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Stepper activeStep={3} />

        <div className="mx-auto mt-10 max-w-xl">
          <div className="rounded-3xl bg-white p-8 text-center shadow-card">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckIcon className="h-8 w-8" />
            </span>
            <h1 className="mt-6 text-2xl font-bold text-slate-950">¡Reserva creada!</h1>
            <p className="mt-2 text-sm text-slate-500">
              {email ? (
                <>Enviamos los detalles a <span className="font-medium text-slate-700">{email}</span>.</>
              ) : (
                "Te enviamos los detalles por correo."
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                <span className="text-slate-500">Código</span>
                <span className="font-bold tracking-wide text-slate-900">{refReserva(reserva.reservaId)}</span>
              </span>
              {reserva.estado ? (
                <span className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">
                  {reserva.estado}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/viaje-${viajeId ?? reserva.reservaId}-1/160/160`}
                alt={titulo}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <p className="font-semibold text-slate-950">{titulo}</p>
            </div>

            <dl className="mt-6 space-y-2.5 border-t border-slate-200 pt-5 text-sm">
              <Row label="Fechas" value={fechaLabel} />
              <Row label="Viajeros" value={`${viajeros} ${viajeros === 1 ? "adulto" : "adultos"}`} />
              <Row label="Total" value={formatCurrency(total)} strong />
            </dl>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/reservas" className="btn btn-primary px-5">
              Ver mis reservas
            </Link>
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300">
              Explorar más destinos
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={strong ? "font-bold text-slate-950" : "font-medium text-slate-900"}>{value}</dd>
    </div>
  );
}
