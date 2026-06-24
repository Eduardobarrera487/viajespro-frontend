import { redirect } from "next/navigation";

import { LikesPanel } from "@/components/features/likes/LikesPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getMisLikes } from "@/lib/api/interacciones";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Mis likes · ViajesPro" };

export default async function LikesPage() {
  const session = await getSession();
  if (!session?.token) redirect("/auth");

  const res = await getMisLikes();
  if (res.status === 401) redirect("/auth");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Mis likes</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">Viajes que guardaste con el corazón.</p>
          <div className="mt-8">
            <LikesPanel likes={Array.isArray(res.data) ? res.data : []} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
