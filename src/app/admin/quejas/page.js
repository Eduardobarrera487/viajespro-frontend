import { redirect } from "next/navigation";

import { AdminQuejasPanel } from "@/components/features/admin/AdminQuejasPanel";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAdminQuejas } from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Quejas admin · ViajesPro" };

export default async function AdminQuejasPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const res = await getAdminQuejas();
  if (res.status === 401) redirect("/auth");
  if (res.status === 403) redirect("/");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Quejas" description="Revisa, responde y cierra quejas de usuarios.">
          <AdminQuejasPanel quejas={Array.isArray(res.data) ? res.data : []} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
