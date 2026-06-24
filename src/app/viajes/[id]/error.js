"use client";

/**
 * Límite de error del detalle de viaje (p.ej. si el API responde 500).
 */
export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h2 className="text-xl font-semibold text-slate-900">No pudimos cargar el viaje</h2>
      <p className="max-w-md text-sm text-slate-500">
        {error?.message || "Inténtalo de nuevo en unos momentos."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn btn-primary px-5"
      >
        Reintentar
      </button>
    </div>
  );
}
