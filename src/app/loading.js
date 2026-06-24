import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton de la exploración de destinos (sidebar de filtros + grid). */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-36 rounded-2xl" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Sidebar */}
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-5 h-10 w-full rounded-xl" />
          <Skeleton className="mt-5 h-10 w-full rounded-xl" />
          <Skeleton className="mt-5 h-24 w-full rounded-xl" />
          <Skeleton className="mt-6 h-11 w-full rounded-xl" />
        </div>

        {/* Resultados */}
        <div>
          <div className="flex items-end justify-between">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-card">
                <Skeleton className="h-44 w-full rounded-none" />
                <div className="p-5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-5 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-4 h-6 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
