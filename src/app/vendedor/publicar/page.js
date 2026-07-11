import Link from "next/link";
import { redirect } from "next/navigation";

import { PublicarViajeForm } from "@/components/features/vendedor/PublicarViajeForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getCatalogosPublicacion } from "@/lib/api/publicaciones";
import { estadoCertificacion } from "@/lib/api/agentes";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Publicar viaje · ViajesPro",
};

export default async function PublicarViajePage({ searchParams }) {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const catalogosRes = await getCatalogosPublicacion();
  if (catalogosRes.status === 401) redirect("/auth");

  const tipos = Array.isArray(catalogosRes.data?.tipos)
    ? catalogosRes.data.tipos
    : Array.isArray(catalogosRes.data?.Tipos)
      ? catalogosRes.data.Tipos
      : [];

  // Punto #1: solo un agente certificado puede publicar.
  //  - Si el módulo de certificación existe (disponible) y NO está aprobado → bloquear el form.
  //  - Si el módulo aún no existe (backend no listo) → permitir (degradado).
  //  - Demo: ?preview=nocert (bloqueado) | ?preview=cert (permitido).
  const sp = await searchParams;
  const { disponible, estado } = await estadoCertificacion();
  const certificado =
    sp?.preview === "nocert"
      ? false
      : sp?.preview === "cert"
        ? true
        : !disponible || estado === "aprobada";

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Panel de vendedor</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Publicar un viaje
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Crea un destino vendible, configura precio, cupos, fecha de salida e imagen comercial.
              </p>
              <Link
                href="/vendedor/certificacion"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                ¿Eres agente? Gestiona tu certificación →
              </Link>
            </div>
          </div>

          {certificado ? (
            <PublicarViajeForm tipos={tipos} />
          ) : (
            <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-8 text-center md:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">🔒</div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">Necesitas ser agente certificado</h2>
              <p className="mx-auto mt-2 max-w-md text-slate-600">
                Para publicar viajes primero debes enviar tus datos legales (cédula y licencia) y que un
                administrador apruebe tu certificación.
              </p>
              <Link
                href="/vendedor/certificacion"
                className="mt-6 inline-flex rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white transition hover:bg-amber-700"
              >
                Solicitar certificación
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
