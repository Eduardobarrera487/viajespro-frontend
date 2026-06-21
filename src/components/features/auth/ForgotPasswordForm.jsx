"use client";

import Link from "next/link";
import { useActionState } from "react";
import { TextField } from "@/components/features/auth/fields";
import { MailIcon } from "@/components/features/auth/icons";
import { FormBanner } from "@/components/features/auth/FormBanner";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { initialForgotState } from "@/lib/auth/state";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialForgotState,
  );

  // Estado de confirmación: ocultamos el formulario tras un envío correcto.
  if (state.success) {
    return (
      <div className="mt-6">
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-700"
        >
          Si existe una cuenta con ese correo, te enviamos las instrucciones para
          restablecer tu contraseña. Revisa tu bandeja de entrada y el spam.
        </div>
        <Link
          href="/auth"
          className="mt-6 inline-flex text-sm auth-link"
        >
          ← Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5" noValidate>
      <FormBanner>{state.error}</FormBanner>

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

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn btn-primary w-full"
      >
        {pending ? "Enviando…" : "Enviar enlace de recuperación"}
      </button>

      <Link href="/auth" className="text-center text-sm auth-link">
        ← Volver a iniciar sesión
      </Link>
    </form>
  );
}
