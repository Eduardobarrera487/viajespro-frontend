"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { logoutAction } from "@/lib/auth/actions";
import { actualizarPerfilAction, cambiarPasswordAction } from "@/lib/perfil/actions";

const perfilInitialState = {
  ok: false,
  error: null,
  success: null,
  fieldErrors: {},
  values: {},
};

const passwordInitialState = {
  ok: false,
  error: null,
  success: null,
  fieldErrors: {},
};

function getValue(obj, ...keys) {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null) return value;
  }
  return "";
}

function getInitials(name) {
  return String(name || "VP")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SubmitButton({ children, variant = "primary" }) {
  const { pending } = useFormStatus();

  const classes =
    variant === "danger"
      ? "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${classes}`}
    >
      {pending ? "Procesando..." : children}
    </button>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-semibold text-rose-600">{message}</p>;
}

function Alert({ type, children }) {
  if (!children) return null;

  const classes =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${classes}`}>{children}</div>;
}

export function PerfilPanel({ perfil, apiError }) {
  const nombre = getValue(perfil, "nombre", "Nombre", "name");
  const email = getValue(perfil, "email", "Email");
  const telefono = getValue(perfil, "telefono", "Telefono");
  const rol = getValue(perfil, "rol", "Rol") || "Usuario";
  const initials = getInitials(nombre || email);

  const [perfilState, perfilAction] = useActionState(actualizarPerfilAction, {
    ...perfilInitialState,
    values: { nombre, email, telefono },
  });

  const [passwordState, passwordAction] = useActionState(cambiarPasswordAction, passwordInitialState);

  const values = {
    nombre: perfilState.values?.nombre ?? nombre,
    email: perfilState.values?.email ?? email,
    telefono: perfilState.values?.telefono ?? telefono,
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold text-blue-700">Mi cuenta</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Mi perfil</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Actualizá tus datos personales, cambiá tu contraseña o cerrá sesión.
            </p>
          </div>

          <form action={logoutAction}>
            <SubmitButton variant="danger">Cerrar sesión</SubmitButton>
          </form>
        </div>

        {apiError ? <div className="mb-6"><Alert>{apiError}</Alert></div> : null}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-[28px] bg-blue-50 text-2xl font-black text-blue-700">
                {initials}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black text-slate-950">{nombre || "Usuario"}</h2>
                <p className="truncate text-sm font-semibold text-slate-500">{email}</p>
              </div>
            </div>

            <dl className="mt-8 space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="font-bold text-slate-500">Rol</dt>
                <dd className="mt-1 font-black text-slate-950">{rol}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="font-bold text-slate-500">Teléfono</dt>
                <dd className="mt-1 font-black text-slate-950">{telefono || "No registrado"}</dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-950">Información personal</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Estos datos se usan para identificar tu cuenta y tus reservas.
                </p>
              </div>

              <form action={perfilAction} className="space-y-5">
                <Alert type="success">{perfilState.success}</Alert>
                <Alert>{perfilState.error}</Alert>

                <div>
                  <label htmlFor="nombre" className="mb-2 block text-sm font-black text-slate-700">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    defaultValue={values.nombre}
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    placeholder="Ej. Bradly Gutierrez"
                  />
                  <FieldError message={perfilState.fieldErrors?.nombre} />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-700">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={values.email}
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      placeholder="correo@ejemplo.com"
                    />
                    <FieldError message={perfilState.fieldErrors?.email} />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="mb-2 block text-sm font-black text-slate-700">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      defaultValue={values.telefono}
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej. 8888 8888"
                    />
                    <FieldError message={perfilState.fieldErrors?.telefono} />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <SubmitButton>Guardar cambios</SubmitButton>
                </div>
              </form>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-950">Seguridad</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Cambiá tu contraseña usando tu contraseña actual.
                </p>
              </div>

              <form action={passwordAction} className="space-y-5">
                <Alert type="success">{passwordState.success}</Alert>
                <Alert>{passwordState.error}</Alert>

                <div>
                  <label htmlFor="passwordActual" className="mb-2 block text-sm font-black text-slate-700">
                    Contraseña actual
                  </label>
                  <input
                    id="passwordActual"
                    name="passwordActual"
                    type="password"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                  <FieldError message={passwordState.fieldErrors?.passwordActual} />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="passwordNueva" className="mb-2 block text-sm font-black text-slate-700">
                      Nueva contraseña
                    </label>
                    <input
                      id="passwordNueva"
                      name="passwordNueva"
                      type="password"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <FieldError message={passwordState.fieldErrors?.passwordNueva} />
                  </div>

                  <div>
                    <label htmlFor="confirmarPassword" className="mb-2 block text-sm font-black text-slate-700">
                      Confirmar contraseña
                    </label>
                    <input
                      id="confirmarPassword"
                      name="confirmarPassword"
                      type="password"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <FieldError message={passwordState.fieldErrors?.confirmarPassword} />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <SubmitButton>Actualizar contraseña</SubmitButton>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
