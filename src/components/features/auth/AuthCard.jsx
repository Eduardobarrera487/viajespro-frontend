"use client";

import { useState } from "react";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { RegisterForm } from "@/components/features/auth/RegisterForm";

const TABS = [
  { id: "login", label: "Iniciar sesión" },
  { id: "register", label: "Crear cuenta" },
];

/**
 * Tarjeta de autenticación con control segmentado.
 * Alterna entre los formularios de login y registro en el cliente,
 * sin navegar a otra ruta.
 */
export function AuthCard() {
  const [tab, setTab] = useState("login");

  return (
    <div className="auth-card">
      <header className="text-center">
        <h2 className="text-xl font-bold text-zinc-900">Bienvenido a ViajesPro</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Gestiona tus reservas y descubre el mundo.
        </p>
      </header>

      {/* Control segmentado: alterna el form sin cambiar de página */}
      <div
        role="tablist"
        aria-label="Acceder o crear cuenta"
        className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={active}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`h-9 rounded-lg text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                active
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "login" ? (
          <div role="tabpanel" id="panel-login" aria-labelledby="tab-login">
            <LoginForm />
          </div>
        ) : (
          <div role="tabpanel" id="panel-register" aria-labelledby="tab-register">
            <RegisterForm />
          </div>
        )}
      </div>
    </div>
  );
}
