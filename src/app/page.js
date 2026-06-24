export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-card">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20" />
                <path d="M7 6l5 6-5 6" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold">ViajesPro</p>
              <p className="text-xs text-slate-500">Tu agencia de viajes digital</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#" className="text-slate-900">Exploración de Destinos</a>
            <a href="#" className="hover:text-slate-950">Historial de Reservas</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
              <span className="sr-only">Notificaciones</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>

            <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" alt="Perfil" className="h-10 w-10 rounded-full object-cover" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Juan Pérez</p>
                <p className="text-xs text-slate-500">Mi Cuenta</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Reserva</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Confirmar tu viaje</h1>
            </div>
            <div className="flex items-center gap-4">
              <Step number="1" label="Revisión" active />
              <Step number="2" label="Datos" />
              <Step number="3" label="Confirmación" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Revisar Selección</p>
                  <p className="mt-1 text-sm text-slate-500">Comprueba los datos antes de continuar.</p>
                </div>
                <a href="#" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Editar</a>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[220px_auto] sm:items-center">
                <div className="overflow-hidden rounded-3xl bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80" alt="Escapada a Santorini" className="h-44 w-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-base font-semibold text-slate-950">Escapada a Santorini: Magia en el Egeo</p>
                    <p className="mt-1 text-sm text-slate-500">Islas Griegas, Grecia</p>
                  </div>

                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">Fechas</dt>
                      <dd className="mt-1 font-medium text-slate-900">15 Oct - 19 Oct 2024</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Viajeros</dt>
                      <dd className="mt-1 font-medium text-slate-900">2 Adultos</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Datos del Viajero Principal</h2>
                  <p className="mt-1 text-sm text-slate-500">Completa la información para la reserva.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Nombre Completo" value="Juan Pérez" readOnly />
                <Field label="Correo Electrónico" value="juan@ejemplo.com" readOnly />
                <Field label="Teléfono" value="+34 612 345 678" readOnly />
                <Field label="Pasaporte / DNI" placeholder="Número de documento" />
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-base font-semibold text-slate-950">Viajero 2</p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre Completo" placeholder="Ej. María García" />
                  <Field label="Pasaporte / DNI" placeholder="Número de documento" />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-950">Políticas y Condiciones</h2>
              </div>

              <div className="mt-6 max-h-56 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-slate-950">1. Cancelación y Reembolsos</p>
                    <p>Las cancelaciones realizadas con 14 días o más de anticipación a la fecha de inicio del viaje recibirán un reembolso completo. Las cancelaciones dentro de los 13 días previos no son reembolsables.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">2. Requisitos de Documentación</p>
                    <p>Es responsabilidad del viajero asegurar que todos los documentos de viaje (pasaportes, visas, DNI) estén vigentes y cumplan con los requisitos del destino.</p>
                  </div>
                </div>
              </div>

              <label className="mt-6 inline-flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                <span>He leído y acepto las políticas de cancelación, términos y condiciones de la reserva.</span>
              </label>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-950">Resumen de Reserva</p>
                  <p className="mt-1 text-sm text-slate-500">Confirma tu reserva antes de pagar.</p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80" alt="Santorini" className="h-14 w-14 rounded-2xl object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">Escapada a Santorini</p>
                    <p className="text-sm text-slate-500">Paquete Premium</p>
                  </div>
                </div>
              </div>

              <dl className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <dt>Viaje (2 Adultos)</dt>
                  <dd className="font-semibold text-slate-950">$1,780</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Impuestos y tasas</dt>
                  <dd className="font-semibold text-slate-950">$120</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Seguro de viaje (Opcional)</dt>
                  <dd className="font-semibold text-slate-950">$0</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-3xl border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                  <span>Total a pagar</span>
                  <span>$1,900</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">Incluye todos los impuestos</p>
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-5 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                Confirmar Reserva ✓
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">Pago simulado seguro</p>
            </section>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20" />
                <path d="M7 6l5 6-5 6" />
              </svg>
            </div>
            <span>ViajesPro © 2024</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-start sm:justify-center">
            <a href="#" className="transition hover:text-slate-900">Términos</a>
            <a href="#" className="transition hover:text-slate-900">Privacidad</a>
            <a href="#" className="transition hover:text-slate-900">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ number, label, active }) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-3 ${active ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-200 bg-white text-slate-700"}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-current/10 text-sm font-semibold text-current">{number}</span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

function Field({ label, value, placeholder, readOnly }) {
  return (
    <label className="space-y-2 text-sm text-slate-700">
      <span className="block font-medium text-slate-900">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </label>
  );
}
