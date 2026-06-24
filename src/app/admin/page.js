import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/features/admin/AdminDashboard";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAdminDashboard } from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Admin · ViajesPro" };

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const res = await getAdminDashboard();
  if (res.status === 401) redirect("/auth");
  if (res.status === 403) redirect("/");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Dashboard" description="Resumen operativo de usuarios, ventas, reservas, likes, compartidos y quejas.">
          <AdminDashboard data={res.data ?? {}} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
