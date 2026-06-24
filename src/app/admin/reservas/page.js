import { redirect } from "next/navigation";

import { AdminReservasPanel } from "@/components/features/admin/AdminReservasPanel";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getAdminEstadosReserva, getAdminReservas } from "@/lib/api/admin";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Reservas admin · ViajesPro" };

export default async function AdminReservasPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const [reservasRes, estadosRes] = await Promise.all([getAdminReservas(), getAdminEstadosReserva()]);
  if (reservasRes.status === 401) redirect("/auth");
  if (reservasRes.status === 403) redirect("/");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Reservas" description="Consulta reservas y cambia estados administrativos.">
          <AdminReservasPanel reservas={Array.isArray(reservasRes.data) ? reservasRes.data : []} estados={Array.isArray(estadosRes.data) ? estadosRes.data : []} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
