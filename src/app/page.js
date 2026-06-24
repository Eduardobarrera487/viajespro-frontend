import { redirect } from "next/navigation";

import { getViajes, getTipos } from "@/lib/api/viajes";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DestinosExplorer } from "@/components/features/viajes/DestinosExplorer";

export const metadata = {
  title: "Exploración de destinos · ViajesPro",
};

export default async function HomePage() {
  const [viajesRes, tiposRes] = await Promise.all([
    getViajes({ activo: true }),
    getTipos(),
  ]);

  if (viajesRes.status === 401) redirect("/logout"); // cookie inválida → limpiar y a login
  if (!viajesRes.ok) throw new Error("No se pudieron cargar los viajes desde la API.");

  const viajes = Array.isArray(viajesRes.data) ? viajesRes.data : [];
  const tipos = Array.isArray(tiposRes.data) ? tiposRes.data : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DestinosExplorer viajes={viajes} tipos={tipos} />
      </main>

      <SiteFooter />
    </div>
  );
}
