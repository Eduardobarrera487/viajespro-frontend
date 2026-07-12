"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import { Stepper } from "@/components/features/reservas/Stepper";
import { crearReservaAction } from "@/lib/reservas/actions";
import { initialReservaState } from "@/lib/reservas/state";
import {
  ArrowLeftIcon,
  MapPinIcon,
  CheckIcon,
} from "@/components/features/viajes/icons";

/**
 * Proceso de reserva (paso 2: revisión + datos). Al confirmar, envía a la
 * Server Action que crea la reserva en la BD (POST /api/Reservas) y redirige
 * a la confirmación con el id real.
 *
 * @param {{
 *   viajeId: number, disponibilidadId: number | null, titulo: string,
 *   ubicacion: string, tipoNombre: string, imageUrl: string, precio: number,
 *   viajeros: number, fechaLabel: string,
 *   usuario: { nombre: string, email: string, telefono: string }
 * }} props
 */
export function CheckoutForm({
  viajeId,
  disponibilidadId,
  titulo,
  ubicacion,
  tipoNombre,
  imageUrl,
  precio,
  viajeros,
  fechaLabel,
  usuario,
}) {
  const [state, formAction, pending] = useActionState(crearReservaAction, initialReservaState);
  const [accepted, setAccepted] = useState(false);

  const { subtotal, impuestos, seguro, total } = computeTotals(precio, viajeros);
  const acompanantes = Array.from({ length: Math.max(0, viajeros - 1) }, (_, i) => i + 2);
  const errs = state.fieldErrors ?? {};

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/viajes/${viajeId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Volver al detalle
      </Link>

      <Stepper activeStep={2} />

      <form action={formAction} className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.95fr] xl:items-start">
        {/* Datos que la acción necesita */}
        <input type="hidden" name="viajeId" value={viajeId} />
        <input type="hidden" name="disponibilidadId" value={disponibilidadId ?? ""} />
        <input type="hidden" name="viajeros" value={viajeros} />

        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Revisar selección */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-base font-semibold text-slate-900">Revisar selección</p>
                <p className="mt-1 text-sm text-slate-500">Comprueba los datos antes de continuar.</p>
              </div>
              <Link href={`/viajes/${viajeId}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                Editar
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[220px_auto] sm:items-center">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-slate-100">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={titulo} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center text-4xl text-slate-300">✈</div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-base font-semibold text-slate-950">{titulo}</p>
                  {ubicacion ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPinIcon className="h-4 w-4 text-slate-400" /> {ubicacion}
                    </p>
                  ) : null}
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Fechas</dt>
                    <dd className="mt-1 font-medium text-slate-900">{fechaLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Viajeros</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {viajeros} {viajeros === 1 ? "Adulto" : "Adultos"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Datos de viajeros */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950">Datos del viajero principal</h2>
            <p className="mt-1 text-sm text-slate-500">Completa la información para la reserva.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre completo" defaultValue={usuario.nombre} readOnly />
              <Field label="Correo electrónico" defaultValue={usuario.email} readOnly />
              <Field
                label="Teléfono"
                defaultValue={usuario.telefono}
                readOnly={Boolean(usuario.telefono)}
                placeholder="Añade tu teléfono"
                name="telefono"
              />
              <Field label="Pasaporte / DNI" name="doc_1" placeholder="Número de documento" error={errs.doc_1} disabled={pending} />
            </div>

            {acompanantes.map((n) => (
              <div key={n} className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-base font-semibold text-slate-950">Viajero {n}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre completo" name={`nombre_${n}`} placeholder="Ej. María García" error={errs[`nombre_${n}`]} disabled={pending} />
                  <Field label="Pasaporte / DNI" name={`doc_${n}`} placeholder="Número de documento" error={errs[`doc_${n}`]} disabled={pending} />
                </div>
              </div>
            ))}
          </section>

          {/* Políticas */}
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950">Políticas y condiciones</h2>

            <div className="mt-6 max-h-56 space-y-4 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              <div>
                <p className="font-semibold text-slate-950">1. Cancelación y reembolsos</p>
                <p>
                  Las cancelaciones realizadas con 14 días o más de anticipación a la fecha de inicio
                  del viaje recibirán un reembolso completo. Las cancelaciones dentro de los 13 días
                  previos no son reembolsables.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">2. Requisitos de documentación</p>
                <p>
                  Es responsabilidad del viajero asegurar que todos los documentos de viaje
                  (pasaportes, visas, DNI) estén vigentes y cumplan con los requisitos del destino.
                </p>
              </div>
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="acepto"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={pending}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-500/40"
              />
              <span>
                He leído y acepto las políticas de cancelación, términos y condiciones de la reserva.
              </span>
            </label>
          </section>
        </div>

        {/* Columna derecha: resumen */}
        <aside className="xl:sticky xl:top-24">
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <p className="text-lg font-semibold text-slate-950">Resumen de reserva</p>

            <div className="mt-6 flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={titulo} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-slate-300">✈</div>
              )}
              <div>
                <p className="font-semibold text-slate-950">{titulo}</p>
                <p className="text-sm text-slate-500">{tipoNombre}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt>Viaje ({viajeros} {viajeros === 1 ? "adulto" : "adultos"})</dt>
                <dd className="font-semibold text-slate-950">{formatCurrency(subtotal)}</dd>
              </div>
              {impuestos > 0 ? (
                <div className="flex items-center justify-between">
                  <dt>Impuestos y tasas</dt>
                  <dd className="font-semibold text-slate-950">{formatCurrency(impuestos)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt>Seguro de viaje (opcional)</dt>
                <dd className="font-semibold text-slate-950">{formatCurrency(seguro)}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-950">Total a pagar</span>
                <span className="text-xl font-bold text-slate-950">{formatCurrency(total)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Incluye todos los impuestos</p>
            </div>

            {state.error ? (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!accepted || pending}
              aria-busy={pending}
              className="btn btn-primary mt-5 w-full gap-2"
            >
              {pending ? "Procesando…" : <>Confirmar reserva <CheckIcon className="h-4 w-4" /></>}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">Pago simulado seguro</p>
          </section>
        </aside>
      </form>
    </main>
  );
}

/** Campo de formulario del checkout. */
function Field({ label, name, defaultValue, placeholder, readOnly = false, disabled = false, error }) {
  return (
    <label className="space-y-2 text-sm">
      <span className="block font-medium text-slate-900">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 read-only:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 disabled:opacity-60 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
            : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/20"
        }`}
      />
      {error ? <span className="block text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
