import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { MapPinIcon } from "@/components/features/viajes/icons";

/**
 * Tarjeta de un viaje en la lista de exploración.
 * Usa la forma del listado: GET /api/Viajes (ciudad/país/tipo son strings).
 *
 * @param {{ viaje: {
 *   viajeId: number, titulo: string, descripcion?: string, precio: number,
 *   tipoViaje?: string, destino?: { ciudad?: string, pais?: string }
 * } }} props
 */
export function ViajeCard({ viaje }) {
  const ubicacion = [viaje.destino?.ciudad, viaje.destino?.pais].filter(Boolean).join(", ");
  const imagen = viaje.imagenUrl ?? viaje.ImagenUrl;

  return (
    <Link
      href={`/viajes/${viaje.viajeId}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100">
        {/* Imagen real; si no hay, una aleatoria estable (sembrada por id) solo en exploración. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagen ?? `https://picsum.photos/seed/viaje-${viaje.viajeId}/600/400`}
          alt={viaje.titulo}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {viaje.tipoViaje ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
            {viaje.tipoViaje}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {ubicacion ? (
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPinIcon className="h-3.5 w-3.5 text-slate-400" /> {ubicacion}
          </p>
        ) : null}
        <h3 className="mt-1.5 text-base font-semibold text-slate-950">{viaje.titulo}</h3>
        {viaje.descripcion ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{viaje.descripcion}</p>
        ) : null}

        <div className="mt-4 flex items-end justify-between pt-2">
          <p className="text-sm text-slate-500">
            desde <span className="text-lg font-bold text-slate-950">{formatCurrency(viaje.precio)}</span>
          </p>
          <span className="text-sm font-semibold text-brand-600 group-hover:text-brand-700">Ver detalle →</span>
        </div>
      </div>
    </Link>
  );
}
