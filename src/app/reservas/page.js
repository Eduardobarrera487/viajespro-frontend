import { redirect } from "next/navigation";

import { ReservasTabs } from "@/components/features/reservas/ReservasTabs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getMisLikes } from "@/lib/api/interacciones";
import { getMisReservas } from "@/lib/api/reservas";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Mis reservas · ViajesPro",
};

function pick(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toNumber(value, fallback = null) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function absoluteImageUrl(url) {
  if (!url) return null;
  if (String(url).startsWith("http")) return url;

  const base = process.env.API_BASE_URL?.replace(/\/+$/, "");
  if (!base) return url;

  return `${base}${String(url).startsWith("/") ? "" : "/"}${url}`;
}

function categorizar(reserva, hoy) {
  const estado = String(pick(reserva.estado, reserva.Estado, reserva.estadoReserva?.nombre, reserva.EstadoReserva?.Nombre, "") || "").toLowerCase();
  if (estado === "cancelada" || estado === "cancelado") return "cancelada";

  const fechaValue = pick(
    reserva.fecha,
    reserva.Fecha,
    reserva.disponibilidad?.fecha,
    reserva.Disponibilidad?.Fecha,
  );

  const fecha = fechaValue ? new Date(fechaValue) : null;
  if (fecha && !Number.isNaN(fecha.getTime()) && fecha.getTime() < hoy.getTime()) return "pasada";

  return "proxima";
}

function normalizeReserva(raw, likedIds, hoy) {
  const disponibilidad = pick(raw.disponibilidad, raw.Disponibilidad, {});
  const viaje = pick(raw.viaje, raw.Viaje, disponibilidad?.viaje, disponibilidad?.Viaje, {});
  const destino = pick(viaje?.destino, viaje?.Destino, raw.destino, raw.Destino, {});
  const ciudad = pick(destino?.ciudad, destino?.Ciudad, raw.ciudad, raw.Ciudad, {});
  const pais = pick(ciudad?.pais, ciudad?.Pais, raw.pais, raw.Pais, {});

  const reservaId = toNumber(pick(raw.reservaId, raw.ReservaId, raw.id, raw.Id), 0);
  const viajeId = toNumber(pick(raw.viajeId, raw.ViajeId, viaje?.viajeId, viaje?.ViajeId), null);
  const cantidadPersonas = toNumber(pick(raw.cantidadPersonas, raw.CantidadPersonas), 1);
  const precioUnitario = toNumber(pick(raw.precioUnitario, raw.PrecioUnitario, viaje?.precio, viaje?.Precio), 0);
  const total = toNumber(pick(raw.total, raw.Total, raw.totalPagado, raw.TotalPagado), precioUnitario * cantidadPersonas);

  const ciudadNombre = pick(ciudad?.nombre, ciudad?.Nombre);
  const paisNombre = pick(pais?.nombre, pais?.Nombre);

  return {
    reservaId,
    viajeId,
    estado: pick(raw.estado, raw.Estado, raw.estadoReserva?.nombre, raw.EstadoReserva?.Nombre, "Pendiente"),
    categoria: categorizar(raw, hoy),
    titulo: pick(raw.titulo, raw.Titulo, viaje?.titulo, viaje?.Titulo, "Viaje"),
    destino: [ciudadNombre, paisNombre].filter(Boolean).join(", "),
    imagenUrl: absoluteImageUrl(pick(raw.imagenUrl, raw.ImagenUrl, viaje?.imagenUrl, viaje?.ImagenUrl)),
    fecha: pick(raw.fecha, raw.Fecha, disponibilidad?.fecha, disponibilidad?.Fecha),
    cantidadPersonas,
    total,
    liked: viajeId ? likedIds.has(Number(viajeId)) : false,
    // Punto #3: la reserva está "pausada" si el viaje se pausó o su estado lo indica.
    pausada:
      String(pick(viaje?.estadoPublicacion, viaje?.EstadoPublicacion, "") || "").toLowerCase() === "pausado" ||
      String(pick(raw.estado, raw.Estado, raw.estadoReserva?.nombre, raw.EstadoReserva?.Nombre, "") || "")
        .toLowerCase() === "pausada" ||
      Boolean(pick(raw.pausada, raw.Pausada)),
  };
}

export default async function ReservasPage({ searchParams }) {
  // DEMO temporal (punto #3): /reservas?preview=pausada marca las reservas como pausadas
  // para previsualizar el banner sin que el backend lo soporte todavía. Quitar luego.
  const sp = await searchParams;
  const previewPausada = sp?.preview === "pausada";

  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const [reservasRes, likesRes] = await Promise.all([getMisReservas(), getMisLikes()]);

  if (reservasRes.status === 401) redirect("/auth");
  if (!reservasRes.ok) throw new Error("No se pudieron cargar tus reservas desde la API.");

  const likedIds = new Set(
    Array.isArray(likesRes.data)
      ? likesRes.data.map((like) => Number(pick(like.viajeId, like.ViajeId))).filter(Boolean)
      : [],
  );

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const reservas = (Array.isArray(reservasRes.data) ? reservasRes.data : [])
    .map((reserva) => normalizeReserva(reserva, likedIds, hoy))
    .filter((reserva) => reserva.reservaId)
    .map((reserva) => (previewPausada ? { ...reserva, pausada: true } : reserva));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Historial de reservas</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Mis reservas</h1>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Gestiona tus próximos viajes, revisa tu historial, comparte reservas y guarda tus favoritos.
            </p>
          </div>

          <ReservasTabs reservas={reservas} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
