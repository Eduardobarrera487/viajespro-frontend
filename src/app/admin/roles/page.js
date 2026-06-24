import { redirect } from "next/navigation";

import { AdminRolesPanel } from "@/components/features/admin/AdminRolesPanel";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAdminRoles } from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Roles · ViajesPro" };

export default async function AdminRolesPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const res = await getAdminRoles();
  if (res.status === 401) redirect("/auth");
  if (res.status === 403) redirect("/");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Roles" description="Consulta los roles existentes y su uso.">
          <AdminRolesPanel roles={Array.isArray(res.data) ? res.data : []} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
