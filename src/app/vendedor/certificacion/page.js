import Link from "next/link";
import { redirect } from "next/navigation";

import { estadoCertificacion } from "@/lib/api/agentes";
import { getSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CertificacionForm } from "@/components/features/agentes/CertificacionForm";

export const metadata = {
  title: "Certificación de agente · ViajesPro",
};

export default async function CertificacionPage({ searchParams }) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  // Demo: /vendedor/certificacion?preview=pendiente|aprobada|rechazada para ver cada estado.
  const sp = await searchParams;
  const cert = await estadoCertificacion();
  const estado = sp?.preview ? String(sp.preview).toLowerCase() : cert.estado;
  const motivo =
    sp?.preview === "rechazada"
      ? (sp?.motivo ?? "No pudimos verificar tu número de licencia. Adjunta un documento legible y vuelve a enviarla.")
      : cert.motivo;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Panel de vendedor</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Certificación de agente
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Para ofrecer viajes debes ser un agente certificado. Envía tus datos legales
            (cédula y licencia) para que un administrador los verifique.
          </p>

          <div className="mt-8">
            {estado === "aprobada" ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <h2 className="text-lg font-black text-emerald-800">✓ Estás certificado</h2>
                <p className="mt-2 text-sm text-emerald-700">Ya puedes publicar viajes.</p>
                <Link href="/vendedor/publicar" className="mt-4 inline-flex rounded-2xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
                  Publicar un viaje
                </Link>
              </div>
            ) : estado === "pendiente" ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <h2 className="text-lg font-black text-amber-800">⏳ Solicitud en revisión</h2>
                <p className="mt-2 text-sm text-amber-700">
                  Tu certificación está siendo revisada. Te avisaremos cuando sea aprobada.
                </p>
              </div>
            ) : (
              <>
                {estado === "rechazada" ? (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p className="font-bold">Tu solicitud fue rechazada</p>
                    <p className="mt-1">
                      <span className="font-semibold">Motivo:</span>{" "}
                      {motivo || "No se especificó un motivo. Revisa tus datos y vuelve a enviarla."}
                    </p>
                  </div>
                ) : null}
                <CertificacionForm />
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
