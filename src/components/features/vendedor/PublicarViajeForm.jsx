"use client";

import { useActionState } from "react";

import { publicarViajeAction } from "@/lib/publicaciones/actions";

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
