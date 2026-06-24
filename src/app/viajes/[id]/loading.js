import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton de carga del detalle de viaje. Se muestra automáticamente (Suspense)
 * mientras el Server Component hace fetch al API.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-36 rounded-2xl" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="mt-4 h-9 w-2/3 max-w-lg" />
        <Skeleton className="mt-3 h-4 w-48" />

        {/* Galería */}
        <div className="mt-6 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-72 rounded-3xl sm:h-[26rem]" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[8.25rem] rounded-3xl sm:h-[12.5rem]" />
            ))}
          </div>
        </div>

        {/* Contenido + sidebar */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-11/12" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-7">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-6 h-11 w-full rounded-xl" />
            <Skeleton className="mt-5 h-11 w-full rounded-xl" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-6 h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
