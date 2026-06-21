import Link from "next/link";
import { getSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getSession();
  const usuario = session?.usuario;

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="auth-card">
        <h1 className="text-xl font-bold text-zinc-900">ViajesPro</h1>

        {session ? (
          <div className="mt-4">
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700"
            >
              ✓ Sesión iniciada correctamente.
            </div>

            <dl className="mt-5 divide-y divide-zinc-100 text-sm">
              <Row label="Nombre" value={usuario?.nombre} />
              <Row label="Correo" value={usuario?.email} />
              <Row label="Teléfono" value={usuario?.telefono || "—"} />
              <Row label="Rol" value={usuario?.rol || `Rol #${usuario?.rolId}`} />
              <Row label="ID de usuario" value={usuario?.usuarioId} />
            </dl>

            <p className="mt-5 text-xs text-zinc-400">
              Vista de prueba. El logout se implementará más adelante; por ahora,
              para cerrar sesión borra la cookie <code>vp_session</code>.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-zinc-500">
              No has iniciado sesión todavía.
            </p>
            <Link href="/auth" className="btn btn-primary mt-5 w-full">
              Iniciar sesión o crear cuenta
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

/** Fila etiqueta/valor dentro de la lista de datos del usuario. */
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
