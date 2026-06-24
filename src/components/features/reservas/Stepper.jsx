/**
 * Indicador de pasos del flujo de reserva (Revisión · Datos · Confirmación).
 * Reutilizado por el checkout (paso 2) y la pantalla de confirmación (paso 3).
 *
 * @param {{ activeStep: number }} props - Paso actual (1-3); los pasos <= activeStep se marcan.
 */
export function Stepper({ activeStep }) {
  const steps = [
    { n: 1, label: "Revisión" },
    { n: 2, label: "Datos" },
    { n: 3, label: "Confirmación" },
  ];

  return (
    <ol className="mx-auto mt-6 flex max-w-2xl items-center">
      {steps.map((step, i) => {
        const done = step.n <= activeStep;
        return (
          <li key={step.n} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  done ? "bg-brand-600 text-white" : "border border-slate-300 bg-white text-slate-400"
                }`}
              >
                {step.n}
              </span>
              <span className={`mt-2 text-xs font-medium ${done ? "text-slate-900" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span
                className={`mx-2 h-0.5 flex-1 rounded ${step.n < activeStep ? "bg-brand-600" : "bg-slate-200"}`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
