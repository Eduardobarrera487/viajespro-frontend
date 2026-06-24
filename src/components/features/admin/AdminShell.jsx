import Link from "next/link";

const LINKS = [
  ["/admin", "Dashboard"],
  ["/admin/usuarios", "Usuarios"],
  ["/admin/roles", "Roles"],
  ["/admin/viajes", "Viajes"],
  ["/admin/reservas", "Reservas"],
  ["/admin/quejas", "Quejas"],
];

export function AdminShell({ title, description, children }) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Administración</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-lg text-slate-600">{description}</p> : null}
        </div>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm">
        {LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            {label}
          </Link>
        ))}
      </nav>

      {children}
    </section>
  );
}
