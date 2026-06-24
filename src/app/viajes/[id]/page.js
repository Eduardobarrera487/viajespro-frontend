import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getViaje } from "@/lib/api/viajes";
import { nightsBetween } from "@/lib/format";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Gallery } from "@/components/features/viajes/Gallery";
import { BookingCard } from "@/components/features/viajes/BookingCard";
import {
  MapPinIcon,
  ShareIcon,
  HeartIcon,
  ChevronRightIcon,
  CheckIcon,
  InfoIcon,
  PlaneIcon,
  BedIcon,
  CoffeeIcon,
  CarIcon,
  SailboatIcon,
} from "@/components/features/viajes/icons";

export const metadata = {
  title: "Detalle del viaje · ViajesPro",
};

export default async function ViajeDetailPage({ params }) {
  const { id } = await params;
  const viajeId = Number(id);
  if (!Number.isInteger(viajeId) || viajeId <= 0) notFound();

  const res = await getViaje(viajeId);
  if (res.status === 401) redirect("/logout");
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("No se pudo cargar el viaje desde la API.");

  const viaje = res.data;
  const ciudad = viaje.destino?.ciudad?.nombre;
  const pais = viaje.destino?.ciudad?.pais?.nombre;
  const disponibilidades = viaje.disponibilidades ?? [];
  const primera = disponibilidades.find((d) => d.activo) ?? disponibilidades[0];
  const noches = primera ? nightsBetween(primera.fecha, primera.fechaRetorno) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="transition-colors hover:text-slate-700">Destinos</Link>
          {pais ? (
            <>
              <ChevronRightIcon className="h-3.5 w-3.5" />
              <span>{pais}</span>
            </>
          ) : null}
          <ChevronRightIcon className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-700">{viaje.titulo}</span>
        </nav>

        {/* Cabecera */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {viaje.titulo}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {(ciudad || pais) ? (
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  {[ciudad, pais].filter(Boolean).join(", ")}
                </span>
              ) : null}
              {viaje.tipoViaje?.nombre ? (
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  {viaje.tipoViaje.nombre}
                </span>
              ) : null}
              {!viaje.activo ? (
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  No disponible
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300">
              <ShareIcon className="h-4 w-4" /> Compartir
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300">
              <HeartIcon className="h-4 w-4" /> Guardar
            </button>
          </div>
        </div>

        {/* Galería */}
        <div className="mt-6">
          <Gallery viajeId={viaje.viajeId} titulo={viaje.titulo} />
        </div>

        {/* Contenido + reserva */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-6">
            {/* Sobre este viaje — descripción real del API */}
            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">Sobre este viaje</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {viaje.descripcion?.trim() ||
                  "Este viaje aún no tiene una descripción detallada."}
              </p>
            </section>

            {/* ¿Qué está incluido? — plantilla (el API no modela inclusiones) */}
            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">¿Qué está incluido?</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Incluido icon={PlaneIcon} titulo="Vuelos ida y vuelta" detalle="Desde tu ciudad de origen" />
                <Incluido
                  icon={BedIcon}
                  titulo={noches ? `${noches} noches de hotel` : "Alojamiento"}
                  detalle="Habitación con servicios"
                />
                <Incluido icon={CoffeeIcon} titulo="Desayunos incluidos" detalle="Buffet diario en el hotel" />
                <Incluido icon={CarIcon} titulo="Traslados privados" detalle="Aeropuerto · Hotel · Aeropuerto" />
                <Incluido icon={SailboatIcon} titulo="Excursión guiada" detalle="Actividad seleccionada del destino" />
              </div>
            </section>

            {/* Itinerario — plantilla genérica derivada de la duración */}
            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">Itinerario del viaje</h2>
              <ol className="mt-6 space-y-6">
                <Paso n={1} titulo="Llegada y bienvenida" detalle="Recepción, traslado al alojamiento y tarde libre para una primera toma de contacto con el destino." />
                <Paso n={2} titulo="Actividad principal" detalle="Jornada con la excursión guiada incluida y tiempo para descubrir los puntos más emblemáticos." />
                <Paso
                  n={noches && noches > 1 ? noches + 1 : 3}
                  titulo="Día libre y salida"
                  detalle="Mañana libre para últimas compras o relax y traslado de regreso según tu vuelo."
                  ultimo
                />
              </ol>
            </section>

            {/* Políticas — plantilla (términos generales) */}
            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">Políticas y condiciones</h2>
              <div className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                <div className="flex gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Cancelación gratuita</p>
                    <p>Cancela hasta 14 días antes del viaje para obtener un reembolso completo.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Requisitos de viaje</p>
                    <p>Pasaporte válido por al menos 6 meses. Seguro de viaje recomendado.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar de reserva (sticky en desktop) */}
          <div className="lg:sticky lg:top-24">
            <BookingCard
              viajeId={viaje.viajeId}
              precio={Number(viaje.precio)}
              disponibilidades={disponibilidades}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Ítem de la sección "¿Qué está incluido?". */
function Incluido({ icon: Icon, titulo, detalle }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{titulo}</p>
        <p className="text-xs text-slate-500">{detalle}</p>
      </div>
    </div>
  );
}

/** Paso del itinerario. */
function Paso({ n, titulo, detalle, ultimo = false }) {
  return (
    <li className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {n}
        </span>
        {!ultimo ? <span className="mt-1 w-px flex-1 bg-slate-200" /> : null}
      </div>
      <div className="pb-1">
        <p className="text-sm font-semibold text-slate-900">{titulo}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{detalle}</p>
      </div>
    </li>
  );
}
