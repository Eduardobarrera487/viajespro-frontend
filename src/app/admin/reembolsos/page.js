import { redirect } from "next/navigation";

import { AdminShell } from "@/components/features/admin/AdminShell";
import { AdminReembolsosPanel } from "@/components/features/admin/AdminReembolsosPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getReembolsos } from "@/lib/api/reembolsos";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Reembolsos · ViajesPro" };

export default async function AdminReembolsosPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const res = await getReembolsos();
  if (res.status === 401) redirect("/auth");
  if (res.status === 403) redirect("/");

  const solicitudes = Array.isArray(res.data) ? res.data : [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Reembolsos" description="Aprueba, rechaza o procesa las solicitudes de reembolso de los clientes.">
          <AdminReembolsosPanel solicitudes={solicitudes} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
