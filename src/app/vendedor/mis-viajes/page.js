import Link from "next/link";
import { redirect } from "next/navigation";

import { MisViajesPanel } from "@/components/features/vendedor/MisViajesPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getMisPublicaciones } from "@/lib/api/publicaciones";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Mis viajes publicados · ViajesPro",
};

export default async function MisViajesPage({ searchParams }) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const res = await getMisPublicaciones();
  if (res.status === 401) redirect("/auth");

  const viajes = Array.isArray(res.data) ? res.data : [];
  const params = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-6xl">
          {params?.publicado ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Viaje publicado correctamente.
            </div>
          ) : null}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Panel de vendedor</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Mis viajes publicados
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Administrá los viajes que estás vendiendo y pausá los que ya no querés mostrar.
              </p>
            </div>

            <Link
              href="/vendedor/publicar"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Publicar nuevo viaje
            </Link>
          </div>

          <MisViajesPanel viajes={viajes} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
