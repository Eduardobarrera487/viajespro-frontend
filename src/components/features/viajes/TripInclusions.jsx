"use client";

import { useState } from "react";
import {
  PlaneIcon,
  BedIcon,
  CoffeeIcon,
  CarIcon,
  SailboatIcon,
  MapPinIcon,
  CheckIcon,
} from "@/components/features/viajes/icons";

/**
 * Secciones "¿Qué está incluido?" (desplegable) e "Itinerario del viaje",
 * alimentadas por datos reales del API con fallback a plantilla si aún no vienen.
 *
 * CONTRATO DE API (ajustar cuando el backend lo exponga en GET /api/Viajes/{id}):
 *   inclusiones: [{ tipo, titulo, detalle }]
 *   hotel:       { nombre, categoria, regimen }
 *   itinerario:  [{ dia, titulo, descripcion, sitios }]
 *
 * @param {{
 *   inclusiones?: Array<object>, itinerario?: Array<object>,
 *   hotel?: { nombre?: string, categoria?: number, regimen?: string } | null,
 *   noches?: number | null
 * }} props
 */
export function TripInclusions({ inclusiones = [], itinerario = [], hotel = null, noches = null }) {
  const items = buildInclusiones(inclusiones, hotel, noches);
  const dias = buildItinerario(itinerario, noches);

  return (
    <>
      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-bold text-slate-950">¿Qué está incluido?</h2>
        <p className="mt-1 text-sm text-slate-500">Toca cada elemento para ver el detalle.</p>
        <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
          {items.map((item, i) => (
            <Accordion
              key={`${item.titulo}-${i}`}
              icon={item.icon}
              titulo={item.titulo}
              detalle={item.detalle}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-bold text-slate-950">Itinerario del viaje</h2>
        <ol className="mt-6 space-y-3">
          {dias.map((dia, i) => (
            <li key={`dia-${i}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {dia.dia}
                </span>
                {i < dias.length - 1 ? <span className="mt-1 w-px flex-1 bg-slate-200" /> : null}
              </div>
              <div className="pb-3">
                <p className="text-sm font-semibold text-slate-900">{dia.titulo}</p>
                {dia.descripcion ? (
                  <p className="mt-1 text-sm leading-6 text-slate-500">{dia.descripcion}</p>
                ) : null}
                {dia.sitios ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <MapPinIcon className="h-3.5 w-3.5" /> {dia.sitios}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

/** Fila de acordeón (título siempre visible, detalle desplegable). */
function Accordion({ icon: Icon, titulo, detalle }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex-1 text-sm font-semibold text-slate-900">{titulo}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div className="px-4 pb-4 pl-16 text-sm leading-6 text-slate-600">{detalle}</div>
      ) : null}
    </div>
  );
}

const TIPO_ICON = {
  vuelo: PlaneIcon,
  hotel: BedIcon,
  alojamiento: BedIcon,
  desayuno: CoffeeIcon,
  comida: CoffeeIcon,
  traslado: CarIcon,
  transporte: CarIcon,
  excursion: SailboatIcon,
  tour: SailboatIcon,
};

function iconForTipo(tipo) {
  return TIPO_ICON[String(tipo || "").toLowerCase()] ?? CheckIcon;
}

/** Construye los ítems del acordeón desde el API, con fallback a plantilla. */
function buildInclusiones(inclusiones, hotel, noches) {
  const items = [];

  if (hotel && (hotel.nombre || hotel.Nombre)) {
    const nombre = hotel.nombre ?? hotel.Nombre;
    const categoria = hotel.categoria ?? hotel.Categoria;
    const regimen = hotel.regimen ?? hotel.Regimen;
    items.push({
      icon: BedIcon,
      titulo: `Hotel: ${nombre}`,
      detalle: [categoria ? `${categoria}★` : null, regimen || "Alojamiento incluido"]
        .filter(Boolean)
        .join(" · "),
    });
  }

  for (const inc of inclusiones ?? []) {
    const tipo = inc.tipo ?? inc.Tipo;
    const titulo = inc.titulo ?? inc.Titulo ?? "Incluido";
    const detalle = inc.detalle ?? inc.Detalle ?? "";
    items.push({ icon: iconForTipo(tipo), titulo, detalle });
  }

  if (items.length > 0) return items;

  // Fallback (mientras el backend no exponga inclusiones): plantilla general.
  return [
    { icon: PlaneIcon, titulo: "Vuelos ida y vuelta", detalle: "Desde tu ciudad de origen (información general — el agente aún no detalló la aerolínea)." },
    { icon: BedIcon, titulo: noches ? `${noches} noches de hotel` : "Alojamiento", detalle: "Habitación con servicios. El detalle del hotel se mostrará aquí cuando el agente lo especifique." },
    { icon: CoffeeIcon, titulo: "Desayunos incluidos", detalle: "Buffet diario en el hotel." },
    { icon: CarIcon, titulo: "Traslados privados", detalle: "Aeropuerto · Hotel · Aeropuerto." },
    { icon: SailboatIcon, titulo: "Excursión guiada", detalle: "Actividad seleccionada del destino." },
  ];
}

/** Construye el itinerario desde el API, con fallback a plantilla por duración. */
function buildItinerario(itinerario, noches) {
  const dias = (itinerario ?? []).map((d, i) => ({
    dia: d.dia ?? d.Dia ?? i + 1,
    titulo: d.titulo ?? d.Titulo ?? `Día ${i + 1}`,
    descripcion: d.descripcion ?? d.Descripcion ?? "",
    sitios: d.sitios ?? d.Sitios ?? "",
  }));

  if (dias.length > 0) return dias;

  const ultimo = noches && noches > 1 ? noches + 1 : 3;
  return [
    { dia: 1, titulo: "Llegada y bienvenida", descripcion: "Recepción, traslado al alojamiento y tarde libre.", sitios: "" },
    { dia: 2, titulo: "Actividad principal", descripcion: "Excursión guiada incluida y puntos emblemáticos del destino.", sitios: "" },
    { dia: ultimo, titulo: "Día libre y salida", descripcion: "Mañana libre y traslado de regreso según tu vuelo.", sitios: "" },
  ];
}
