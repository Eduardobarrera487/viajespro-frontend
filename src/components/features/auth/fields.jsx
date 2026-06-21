"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/features/auth/icons";

// Estilos base en .field-input (globals.css). Aquí solo el override de error.
const errorTone = "border-red-400 focus:border-red-500 focus:ring-red-500/30";

/** Mensaje de error accesible bajo un campo. */
function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

/**
 * Campo de texto con label, icono opcional a la izquierda y soporte de error.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {import('react').ElementType} [props.icon]
 * @param {import('react').ReactNode} [props.action] - Nodo alineado a la derecha del label (p.ej. un link).
 */
export function TextField({ label, name, icon: Icon, action, error, className, ...inputProps }) {
  const autoId = useId();
  const id = inputProps.id ?? `${name}-${autoId}`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400" />
        ) : null}
        <input
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`field-input ${error ? errorTone : ""} ${Icon ? "pl-10 pr-3" : "px-3"}`}
          {...inputProps}
        />
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

/**
 * Campo de contraseña con icono a la izquierda y botón para mostrar/ocultar.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {import('react').ElementType} [props.icon]
 * @param {import('react').ReactNode} [props.action]
 */
export function PasswordField({ label, name, icon: Icon, action, error, className, ...inputProps }) {
  const autoId = useId();
  const id = inputProps.id ?? `${name}-${autoId}`;
  const errorId = `${id}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400" />
        ) : null}
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`field-input ${error ? errorTone : ""} ${Icon ? "pl-10" : "pl-3"} pr-10`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
        >
          {visible ? <EyeOffIcon className="h-4.5 w-4.5" /> : <EyeIcon className="h-4.5 w-4.5" />}
        </button>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
