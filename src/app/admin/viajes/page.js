import { redirect } from "next/navigation";

import { AdminShell } from "@/components/features/admin/AdminShell";
import { AdminViajesPanel } from "@/components/features/admin/AdminViajesPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAdminViajes } from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Viajes admin · ViajesPro" };

export default async function AdminViajesPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const res = await getAdminViajes();
  if (res.status === 401) redirect("/auth");
  if (res.status === 403) redirect("/");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Viajes" description="Controla publicaciones, estado, likes, reservas y compartidos.">
          <AdminViajesPanel viajes={Array.isArray(res.data) ? res.data : []} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
