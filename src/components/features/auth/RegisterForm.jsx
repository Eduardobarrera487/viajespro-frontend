"use client";

import { useActionState } from "react";
import { TextField, PasswordField } from "@/components/features/auth/fields";
import { MailIcon, LockIcon, UserIcon } from "@/components/features/auth/icons";
import { FormBanner } from "@/components/features/auth/FormBanner";
import { registerAction } from "@/lib/auth/actions";
import { initialAuthState } from "@/lib/auth/state";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialAuthState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormBanner>{state.error}</FormBanner>

      <TextField
        label="Nombre completo"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Ej. Juan Pérez"
        icon={UserIcon}
        required
        disabled={pending}
        error={state.fieldErrors?.name}
      />

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        icon={MailIcon}
        required
        disabled={pending}
        error={state.fieldErrors?.email}
      />

      <div className="grid grid-cols-2 gap-4">
        <PasswordField
          label="Contraseña"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          icon={LockIcon}
          required
          disabled={pending}
          error={state.fieldErrors?.password}
        />
        <PasswordField
          label="Confirmar"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          icon={LockIcon}
          required
          disabled={pending}
          error={state.fieldErrors?.confirmPassword}
        />
      </div>

      <div>
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-500">
          <input
            type="checkbox"
            name="terms"
            disabled={pending}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-0"
          />
          <span>
            Acepto los{" "}
            <a href="#" className="auth-link">
              Términos de Servicio
            </a>{" "}
            y la{" "}
            <a href="#" className="auth-link">
              Política de Privacidad
            </a>{" "}
            de la plataforma de reservas.
          </span>
        </label>
        {state.fieldErrors?.terms ? (
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {state.fieldErrors.terms}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn btn-dark mt-1 w-full"
      >
        {pending ? "Creando cuenta…" : "Crear mi cuenta"}
      </button>
    </form>
  );
}
