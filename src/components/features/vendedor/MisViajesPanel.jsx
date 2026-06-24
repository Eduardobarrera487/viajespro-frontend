import Link from "next/link";

import { cambiarEstadoPublicacionAction } from "@/lib/publicaciones/actions";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-NI", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function MisViajesPanel({ viajes = [], admin = false }) {
  if (!viajes.length) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-950">Todavía no hay viajes publicados</h2>
        <p className="mt-2 text-slate-600">Creá tu primer viaje para empezar a vender reservaciones.</p>
        <Link
          href="/vendedor/publicar"
          className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Publicar viaje
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {viajes.map((viaje) => {
        const destino = viaje.destino ?? viaje.Destino;
        const ciudad = destino?.ciudad ?? destino?.Ciudad;
        const pais = ciudad?.pais ?? ciudad?.Pais;
        const disponibilidad = viaje.disponibilidad ?? viaje.Disponibilidad;
        const imagen = viaje.imagenUrl ?? viaje.ImagenUrl;
        const activo = Boolean(viaje.activo ?? viaje.Activo);
        const viajeId = viaje.viajeId ?? viaje.ViajeId;

        return (
          <article key={viajeId} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {imagen ? (
              <img src={imagen} alt="" className="h-52 w-full object-cover" />
            ) : (
              <div className="flex h-52 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">
                Sin imagen
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    {ciudad?.nombre ?? ciudad?.Nombre ?? "Ciudad"}, {pais?.nombre ?? pais?.Nombre ?? "País"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    {viaje.titulo ?? viaje.Titulo}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    activo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {activo ? "Publicado" : "Pausado"}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                {viaje.descripcion ?? viaje.Descripcion ?? "Sin descripción."}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 rounded-3xl bg-slate-50 p-4 text-sm">
                <div>
                  <p className="text-slate-500">Precio</p>
                  <p className="font-bold text-slate-950">{formatCurrency(viaje.precio ?? viaje.Precio)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Salida</p>
                  <p className="font-bold text-slate-950">{formatDate(disponibilidad?.fecha ?? disponibilidad?.Fecha)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Cupos</p>
                  <p className="font-bold text-slate-950">
                    {disponibilidad?.cuposDisponibles ?? disponibilidad?.CuposDisponibles ?? viaje.cuposTotales ?? viaje.CuposTotales}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/viajes/${viajeId}`}
                  className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ver público
                </Link>

                <form action={cambiarEstadoPublicacionAction}>
                  <input type="hidden" name="viajeId" value={viajeId} />
                  <input type="hidden" name="activo" value={(!activo).toString()} />
                  <button
                    type="submit"
                    className="rounded-2xl bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                  >
                    {activo ? "Pausar" : "Publicar"}
                  </button>
                </form>

                {admin ? (
                  <span className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    ID vendedor: {viaje.publicadoPorUsuarioId ?? viaje.PublicadoPorUsuarioId ?? "N/A"}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
