import {
  PlaneTakeoffIcon,
  TicketIcon,
  BuildingIcon,
  MapIcon,
} from "@/components/features/auth/icons";

/**
 * Panel lateral de marca (columna izquierda en desktop).
 * Puramente decorativo/informativo — Server Component, sin estado.
 */
export function BrandPanel() {
  return (
    <aside className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-12 text-white lg:flex">
      {/* Patrón de puntos decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex max-w-sm flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
          <PlaneTakeoffIcon className="h-9 w-9 text-white" />
        </span>

        <h1 className="mt-8 text-3xl font-semibold leading-tight tracking-tight text-balance">
          Tu próximo destino te espera
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-blue-100/90 text-pretty">
          Descubre, planea y reserva viajes inolvidables. Vuelos, paquetes y
          transportes en un solo lugar.
        </p>

        <ul className="mt-10 flex items-center gap-4">
          {[
            { Icon: TicketIcon, label: "Vuelos" },
            { Icon: BuildingIcon, label: "Hoteles" },
            { Icon: MapIcon, label: "Paquetes" },
          ].map(({ Icon, label }) => (
            <li key={label}>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm"
                title={label}
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
