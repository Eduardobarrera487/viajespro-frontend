"use client";

import Link from "next/link";
import { useActionState } from "react";
import { TextField, PasswordField } from "@/components/features/auth/fields";
import { MailIcon, LockIcon } from "@/components/features/auth/icons";
import { FormBanner } from "@/components/features/auth/FormBanner";
import { loginAction } from "@/lib/auth/actions";
import { initialAuthState } from "@/lib/auth/state";

export function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(loginAction, initialAuthState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
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

      <PasswordField
        label="Contraseña"
        name="password"
        autoComplete="current-password"
        placeholder="••••••••"
        icon={LockIcon}
        required
        disabled={pending}
        error={state.fieldErrors?.password}
        action={
          <Link href="/auth/forgot-password" className="auth-link text-xs">
            ¿Olvidaste tu contraseña?
          </Link>
        }
      />

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn btn-primary mt-1 w-full"
      >
        {pending ? "Entrando…" : "Entrar a mi cuenta"}
      </button>
    </form>
  );
}
