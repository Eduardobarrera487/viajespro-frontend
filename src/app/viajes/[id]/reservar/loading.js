import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton del proceso de reserva mientras se hace fetch del viaje. */
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
        <Skeleton className="h-4 w-32" />
        <div className="mx-auto mt-6 flex max-w-2xl justify-between">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-full" />
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-6 h-16 w-full rounded-2xl" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-6 h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
