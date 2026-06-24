"use client";

import { useActionState } from "react";

import { crearQuejaAction } from "@/lib/quejas/actions";

const initialState = {
  error: "",
  fieldErrors: {},
  values: {},
};

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-sm font-bold text-red-600">{error}</p>;
}

export function CrearQuejaForm() {
  const [state, formAction, pending] = useActionState(crearQuejaAction, initialState);
  const values = state?.values ?? {};
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {state?.ok ? (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Queja enviada correctamente.
        </div>
      ) : null}

      {state?.error ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="text-sm font-bold text-slate-700">Tipo</span>
          <select name="tipo" defaultValue={values.tipo ?? "General"} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
            <option value="General">General</option>
            <option value="Reserva">Reserva</option>
            <option value="Pago">Pago</option>
            <option value="Viaje">Viaje</option>
            <option value="Soporte">Soporte</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Reserva ID opcional</span>
          <input name="reservaId" type="number" min="1" defaultValue={values.reservaId ?? ""} placeholder="Ej. 12" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Viaje ID opcional</span>
          <input name="viajeId" type="number" min="1" defaultValue={values.viajeId ?? ""} placeholder="Ej. 5" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">Asunto</span>
          <input name="asunto" defaultValue={values.asunto ?? ""} maxLength={150} placeholder="Resumen del problema" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          <FieldError error={fieldErrors.asunto} />
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Descripción</span>
          <textarea name="descripcion" defaultValue={values.descripcion ?? ""} rows={5} maxLength={1000} placeholder="Explicá lo ocurrido con detalle." className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          <FieldError error={fieldErrors.descripcion} />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button disabled={pending} className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-60">
          {pending ? "Enviando..." : "Enviar queja"}
        </button>
      </div>
    </form>
  );
}
