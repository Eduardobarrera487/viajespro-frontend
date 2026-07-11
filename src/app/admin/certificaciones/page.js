import { redirect } from "next/navigation";

import { AdminShell } from "@/components/features/admin/AdminShell";
import { AdminCertificacionesPanel } from "@/components/features/admin/AdminCertificacionesPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCertificaciones } from "@/lib/api/agentes";
import { getSession } from "@/lib/auth/session";

function isAdmin(session) {
  const rol = String(session?.usuario?.Rol ?? session?.usuario?.rol ?? "").toLowerCase();
  return rol === "administrador" || rol === "admin";
}

export const metadata = { title: "Certificaciones · ViajesPro" };

// Datos de ejemplo para la demo (?preview=1) mientras el backend no exista.
const PREVIEW = [
  { certificacionId: 1, estado: "Pendiente", nombreLegal: "Viajes Pérez S.A.", usuario: { nombre: "Juan Pérez", email: "juan@viajes.com" }, cedula: "0801-1990-12345", numeroLicencia: "AGV-2024-0087" },
  { certificacionId: 2, estado: "Pendiente", nombreLegal: "María García (Freelance)", usuario: { nombre: "María García", email: "maria@travel.com" }, cedula: "0501-1988-54321", numeroLicencia: "AGV-2023-0451" },
];

export default async function AdminCertificacionesPage({ searchParams }) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");
  if (!isAdmin(session)) redirect("/");

  const sp = await searchParams;
  const preview = sp?.preview === "1";

  const res = await getCertificaciones("Pendiente");
  const certificaciones = preview
    ? PREVIEW
    : Array.isArray(res.data)
      ? res.data
      : [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <AdminShell title="Certificaciones" description="Aprueba o rechaza a los agentes que solicitan vender viajes.">
          <AdminCertificacionesPanel certificaciones={certificaciones} />
        </AdminShell>
      </main>
      <SiteFooter />
    </>
  );
}
