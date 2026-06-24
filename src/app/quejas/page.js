import { redirect } from "next/navigation";

import { CrearQuejaForm } from "@/components/features/quejas/CrearQuejaForm";
import { MisQuejasPanel } from "@/components/features/quejas/MisQuejasPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getMisQuejas } from "@/lib/api/quejas";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Quejas y soporte · ViajesPro" };

export default async function QuejasPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const res = await getMisQuejas();
  if (res.status === 401) redirect("/auth");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Quejas y soporte</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">Reporta problemas con reservas, pagos o viajes y revisa las respuestas del equipo.</p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <CrearQuejaForm />
            <MisQuejasPanel quejas={Array.isArray(res.data) ? res.data : []} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
