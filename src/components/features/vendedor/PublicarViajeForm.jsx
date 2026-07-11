"use client";

import { useActionState, useState } from "react";

import { publicarViajeAction } from "@/lib/publicaciones/actions";

const TIPOS_INCLUSION = ["Vuelo", "Hotel", "Desayuno", "Traslado", "Excursion", "Otro"];

const initialState = {
  error: "",
  fieldErrors: {},
  values: {},
};

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-sm font-medium text-red-600">{error}</p>;
}

function getTodayForInput() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function PublicarViajeForm({ tipos = [] }) {
  const [state, formAction, pending] = useActionState(publicarViajeAction, initialState);
  const fieldErrors = state?.fieldErrors ?? {};
  const values = state?.values ?? {};
  const today = getTodayForInput();

  // Punto #2: filas dinámicas de inclusiones e itinerario (viajan al API como JSON).
  const [inclusiones, setInclusiones] = useState([{ tipo: "Hotel", titulo: "", detalle: "" }]);
  const [itinerario, setItinerario] = useState([{ titulo: "", sitios: "", descripcion: "" }]);

  const updateRow = (setter) => (index, campo, valor) =>
    setter((rows) => rows.map((row, i) => (i === index ? { ...row, [campo]: valor } : row)));
  const addRow = (setter, vacio) => () => setter((rows) => [...rows, vacio]);
  const removeRow = (setter) => (index) =>
    setter((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows));

  const setInclusion = updateRow(setInclusiones);
  const setItinerarioRow = updateRow(setItinerario);

  // Solo se envían filas con contenido.
  const inclusionesPayload = inclusiones.filter((r) => r.titulo.trim() || r.detalle.trim());
  const itinerarioPayload = itinerario
    .filter((r) => r.titulo.trim() || r.sitios.trim() || r.descripcion.trim())
    .map((r, i) => ({ dia: i + 1, ...r }));

  return (
    <form action={formAction} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {state?.error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Título del viaje</span>
          <input
            name="Titulo"
            type="text"
            maxLength={150}
            placeholder="Ej. Cancún Paradise: Sol y Arena"
            defaultValue={values.Titulo ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
          <FieldError error={fieldErrors.Titulo} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Tipo de viaje</span>
          <select
            name="TipoViajeId"
            defaultValue={values.TipoViajeId ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          >
            <option value="">Seleccionar</option>
            {tipos.map((tipo) => {
              const id = tipo.tipoViajeId ?? tipo.TipoViajeId;
              const nombre = tipo.nombre ?? tipo.Nombre;

              return (
                <option key={id} value={id}>
                  {nombre}
                </option>
              );
            })}
          </select>
          <FieldError error={fieldErrors.TipoViajeId} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Precio por persona</span>
          <input
            name="Precio"
            type="number"
            min="1"
            step="0.01"
            placeholder="1240"
            defaultValue={values.Precio ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
          <FieldError error={fieldErrors.Precio} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">País</span>
          <input
            name="Pais"
            type="text"
            maxLength={100}
            placeholder="México"
            defaultValue={values.Pais ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
          <FieldError error={fieldErrors.Pais} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Ciudad</span>
          <input
            name="Ciudad"
            type="text"
            maxLength={100}
            placeholder="Cancún"
            defaultValue={values.Ciudad ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
          <FieldError error={fieldErrors.Ciudad} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Fecha de salida</span>
          <input
            name="FechaSalida"
            type="date"
            min={today}
            defaultValue={values.FechaSalida ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
          <FieldError error={fieldErrors.FechaSalida} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Fecha de retorno</span>
          <input
            name="FechaRetorno"
            type="date"
            min={values.FechaSalida || today}
            defaultValue={values.FechaRetorno ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <FieldError error={fieldErrors.FechaRetorno} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Cupos disponibles</span>
          <input
            name="CuposTotales"
            type="number"
            min="1"
            placeholder="20"
            defaultValue={values.CuposTotales ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />
          <FieldError error={fieldErrors.CuposTotales} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Imagen del viaje</span>
          <input
            name="Imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:border-blue-400"
          />
          <p className="mt-1 text-xs text-slate-500">JPG, PNG o WEBP. Máximo 5 MB. Si hay un error, por seguridad el navegador puede pedir seleccionar la imagen otra vez.</p>
          <FieldError error={fieldErrors.Imagen} />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Descripción comercial</span>
          <textarea
            name="Descripcion"
            rows={5}
            maxLength={1000}
            placeholder="Describe la experiencia, lo que incluye y por qué vale la pena reservarla."
            defaultValue={values.Descripcion ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <FieldError error={fieldErrors.Descripcion} />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Descripción del destino</span>
          <textarea
            name="DestinoDescripcion"
            rows={3}
            maxLength={500}
            placeholder="Información breve del destino."
            defaultValue={values.DestinoDescripcion ?? ""}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <FieldError error={fieldErrors.DestinoDescripcion} />
        </label>
      </div>

      {/* Punto #2: hotel, inclusiones e itinerario (para el "¿Qué está incluido?" del detalle) */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/60 p-5 md:p-6">
        <h2 className="text-lg font-black text-slate-950">¿Qué incluye el viaje?</h2>
        <p className="mt-1 text-sm text-slate-500">Esto se mostrará desplegable en el detalle del viaje.</p>

        {/* Hotel y comidas */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="md:col-span-1">
            <span className="text-sm font-semibold text-slate-700">Hotel</span>
            <input
              name="NombreHotel"
              type="text"
              maxLength={200}
              placeholder="Ej. Hotel Riu Palace"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Categoría</span>
            <select
              name="CategoriaHotel"
              defaultValue=""
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">—</option>
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} estrellas</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Régimen de comidas</span>
            <input
              name="RegimenComidas"
              type="text"
              maxLength={100}
              placeholder="Ej. Desayuno buffet"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        {/* Inclusiones */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Incluye</span>
            <button type="button" onClick={addRow(setInclusiones, { tipo: "Otro", titulo: "", detalle: "" })} className="text-sm font-bold text-blue-600 hover:text-blue-700">
              + Añadir
            </button>
          </div>
          <div className="mt-2 space-y-3">
            {inclusiones.map((row, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[130px_1fr_1fr_auto]">
                <select
                  value={row.tipo}
                  onChange={(e) => setInclusion(i, "tipo", e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {TIPOS_INCLUSION.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  value={row.titulo}
                  onChange={(e) => setInclusion(i, "titulo", e.target.value)}
                  placeholder="Título (ej. Vuelos ida y vuelta)"
                  className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  value={row.detalle}
                  onChange={(e) => setInclusion(i, "detalle", e.target.value)}
                  placeholder="Detalle (ej. Desde tu ciudad)"
                  className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button type="button" onClick={() => removeRow(setInclusiones)(i)} aria-label="Quitar" className="rounded-2xl px-3 text-slate-400 hover:text-red-600">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerario */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Itinerario (día por día)</span>
            <button type="button" onClick={addRow(setItinerario, { titulo: "", sitios: "", descripcion: "" })} className="text-sm font-bold text-blue-600 hover:text-blue-700">
              + Añadir día
            </button>
          </div>
          <div className="mt-2 space-y-3">
            {itinerario.map((row, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-600">Día {i + 1}</span>
                  <button type="button" onClick={() => removeRow(setItinerario)(i)} aria-label="Quitar día" className="text-slate-400 hover:text-red-600">✕</button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input
                    value={row.titulo}
                    onChange={(e) => setItinerarioRow(i, "titulo", e.target.value)}
                    placeholder="Título del día"
                    className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <input
                    value={row.sitios}
                    onChange={(e) => setItinerarioRow(i, "sitios", e.target.value)}
                    placeholder="Sitios (ej. Oia, Fira)"
                    className="rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <textarea
                  value={row.descripcion}
                  onChange={(e) => setItinerarioRow(i, "descripcion", e.target.value)}
                  rows={2}
                  placeholder="Qué se hace ese día"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Payload al API (el backend lo aceptará cuando exista el contrato del punto #2) */}
        <input type="hidden" name="Inclusiones" value={JSON.stringify(inclusionesPayload)} />
        <input type="hidden" name="Itinerario" value={JSON.stringify(itinerarioPayload)} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Al publicar, el viaje quedará activo y visible en la exploración de destinos.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Publicando..." : "Publicar viaje"}
        </button>
      </div>
    </form>
  );
}
