import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getViaje } from "@/lib/api/viajes";
import { nightsBetween } from "@/lib/format";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Gallery } from "@/components/features/viajes/Gallery";
import { BookingCard } from "@/components/features/viajes/BookingCard";
import { TripInclusions } from "@/components/features/viajes/TripInclusions";
import {
  MapPinIcon,
  ShareIcon,
  HeartIcon,
  ChevronRightIcon,
  CheckIcon,
  InfoIcon,
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

  // Datos del punto #2 (¿qué incluye? / itinerario). Lectura tolerante camelCase/PascalCase;
  // vienen del API cuando el backend los exponga, si no TripInclusions usa fallback.
  const inclusiones = viaje.inclusiones ?? viaje.Inclusiones ?? [];
  const itinerario = viaje.itinerario ?? viaje.Itinerario ?? [];
  const hotelNombre = viaje.nombreHotel ?? viaje.NombreHotel ?? viaje.hotel?.nombre ?? viaje.Hotel?.Nombre;
  const hotel = hotelNombre
    ? {
        nombre: hotelNombre,
        categoria: viaje.categoriaHotel ?? viaje.CategoriaHotel ?? viaje.hotel?.categoria,
        regimen: viaje.regimenComidas ?? viaje.RegimenComidas ?? viaje.hotel?.regimen,
      }
    : null;

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
          <Gallery imagenUrl={viaje.imagenUrl ?? viaje.ImagenUrl} titulo={viaje.titulo} />
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

            {/* ¿Qué está incluido? (desplegable) + Itinerario — datos reales del API con fallback */}
            <TripInclusions
              inclusiones={inclusiones}
              itinerario={itinerario}
              hotel={hotel}
              noches={noches}
            />

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
