import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton de la pantalla de confirmación mientras se hace fetch del viaje. */
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
        <div className="mx-auto mt-6 flex max-w-2xl justify-between">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-full" />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-xl space-y-6">
          <div className="rounded-3xl bg-white p-8 text-center shadow-card">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto mt-6 h-7 w-56" />
            <Skeleton className="mx-auto mt-3 h-4 w-64" />
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
