import { redirect } from "next/navigation";

import { AdminShell } from "@/components/features/admin/AdminShell";
import { AdminUsuariosPanel } from "@/components/features/admin/AdminUsuariosPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAdminRoles, getAdminUsuarios } from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Usuarios · ViajesPro" };

export default async function AdminUsuariosPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const [usuariosRes, rolesRes] = await Promise.all([getAdminUsuarios(), getAdminRoles()]);
  if (usuariosRes.status === 401) redirect("/auth");
  if (usuariosRes.status === 403) redirect("/");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Usuarios" description="Activa, desactiva y cambia roles de usuarios.">
          <AdminUsuariosPanel usuarios={Array.isArray(usuariosRes.data) ? usuariosRes.data : []} roles={Array.isArray(rolesRes.data) ? rolesRes.data : []} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
