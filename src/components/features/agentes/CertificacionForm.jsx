"use client";

import { useActionState } from "react";
import { solicitarCertificacionAction } from "@/lib/agentes/actions";

const initialState = { error: null, fieldErrors: {}, ok: false };

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-sm font-medium text-red-600">{error}</p>;
}

export function CertificacionForm() {
  const [state, formAction, pending] = useActionState(solicitarCertificacionAction, initialState);
  const errs = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h2 className="text-lg font-black text-emerald-800">✓ Solicitud enviada</h2>
        <p className="mt-2 text-sm text-emerald-700">
          Revisaremos tus datos legales y te avisaremos cuando tu certificación esté aprobada.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {state.error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Nombre legal / Razón social</span>
          <input name="NombreLegal" type="text" maxLength={300} placeholder="Ej. Juan Pérez / Viajes Pérez S.A."
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <FieldError error={errs.NombreLegal} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Cédula</span>
          <input name="Cedula" type="text" maxLength={50} placeholder="Número de documento"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <FieldError error={errs.Cedula} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Número de licencia</span>
          <input name="NumeroLicencia" type="text" maxLength={100} placeholder="Licencia de agente de viajes"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <FieldError error={errs.NumeroLicencia} />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Documento de cédula</span>
          <input name="DocumentoCedula" type="file" accept="image/*,application/pdf"
            className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white" />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Documento de licencia</span>
          <input name="DocumentoLicencia" type="file" accept="image/*,application/pdf"
            className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white" />
        </label>
      </div>

      <button type="submit" disabled={pending}
        className="mt-8 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? "Enviando…" : "Enviar solicitud de certificación"}
      </button>
    </form>
  );
}
