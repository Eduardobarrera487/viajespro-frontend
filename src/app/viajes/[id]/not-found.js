import Link from "next/link";

/** 404 del detalle de viaje (id inexistente o inválido). */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">404</p>
      <h2 className="text-xl font-semibold text-slate-900">Este viaje no existe</h2>
      <p className="max-w-md text-sm text-slate-500">
        El viaje que buscas no está disponible o fue eliminado.
      </p>
      <Link href="/" className="btn btn-primary px-5">
        Ver otros destinos
      </Link>
    </div>
  );
}
