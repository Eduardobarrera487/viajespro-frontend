import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton del historial de reservas mientras se hace fetch al API. */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-36 rounded-2xl" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-72" />

        <div className="mt-8 flex items-center justify-between">
          <Skeleton className="h-11 w-72 rounded-xl" />
          <Skeleton className="h-11 w-72 rounded-xl" />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="mt-5 h-12 w-full" />
              <Skeleton className="mt-4 h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
