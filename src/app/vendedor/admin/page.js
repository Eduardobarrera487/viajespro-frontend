import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminVentasPanel } from "@/components/features/vendedor/AdminVentasPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getPublicacionesAdmin } from "@/lib/api/publicaciones";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Administración de ventas · ViajesPro",
};

export default async function AdminVentasPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const res = await getPublicacionesAdmin();
  if (res.status === 401) redirect("/auth");
  if (res.status === 403) redirect("/");

  const viajes = Array.isArray(res.data) ? res.data : [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Administración</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Panel de ventas
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Revisa las publicaciones de viajes y controla qué se mantiene visible.
              </p>
            </div>

            <Link
              href="/vendedor/publicar"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Publicar viaje
            </Link>
          </div>

          <AdminVentasPanel viajes={viajes} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
