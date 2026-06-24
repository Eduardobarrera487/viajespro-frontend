import Link from "next/link";

import { formatCurrency, formatDate } from "@/lib/format";

export function LikesPanel({ likes = [] }) {
  if (!likes.length) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-black text-slate-950">Sin likes todavía</h2>
        <p className="mt-2 text-slate-600">Usá el corazón en tus reservas para guardar viajes en esta sección.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white">Explorar destinos</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {likes.map((like) => {
        const viaje = like.viaje ?? like.Viaje;
        if (!viaje) return null;

        const id = viaje.viajeId ?? viaje.ViajeId;
        const imagen = viaje.imagenUrl ?? viaje.ImagenUrl;
        const disponibilidad = viaje.disponibilidad ?? viaje.Disponibilidad;
        const destino = viaje.destino ?? viaje.Destino;
        const ciudad = destino?.ciudad ?? destino?.Ciudad;
        const pais = ciudad?.pais ?? ciudad?.Pais;

        return (
          <article key={like.viajeLikeId ?? like.ViajeLikeId} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {imagen ? <img src={imagen} alt="" className="h-56 w-full object-cover" /> : <div className="h-56 bg-slate-100" />}
            <div className="p-6">
              <p className="text-sm font-bold text-blue-600">{ciudad?.nombre ?? ciudad?.Nombre ?? "Ciudad"}, {pais?.nombre ?? pais?.Nombre ?? "País"}</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{viaje.titulo ?? viaje.Titulo}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500">Precio</p><p className="font-black">{formatCurrency(viaje.precio ?? viaje.Precio ?? 0)}</p></div>
                <div><p className="text-slate-500">Salida</p><p className="font-black">{formatDate(disponibilidad?.fecha ?? disponibilidad?.Fecha) ?? "—"}</p></div>
              </div>
              <Link href={`/viajes/${id}`} className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">Ver viaje</Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
