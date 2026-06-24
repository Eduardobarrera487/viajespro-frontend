import { redirect } from "next/navigation";

import { PublicarViajeForm } from "@/components/features/vendedor/PublicarViajeForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCatalogosPublicacion } from "@/lib/api/publicaciones";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Publicar viaje · ViajesPro",
};

export default async function PublicarViajePage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const catalogosRes = await getCatalogosPublicacion();
  if (catalogosRes.status === 401) redirect("/auth");

  const tipos = Array.isArray(catalogosRes.data?.tipos)
    ? catalogosRes.data.tipos
    : Array.isArray(catalogosRes.data?.Tipos)
      ? catalogosRes.data.Tipos
      : [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Panel de vendedor</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Publicar un viaje
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Crea un destino vendible, configura precio, cupos, fecha de salida e imagen comercial.
              </p>
            </div>
          </div>

          <PublicarViajeForm tipos={tipos} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
