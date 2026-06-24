import { AuthCard } from "@/components/features/auth/AuthCard";
import { BrandPanel } from "@/components/features/auth/BrandPanel";

export const metadata = {
  title: "Acceder · ViajesPro",
  description: "Inicia sesión o crea tu cuenta en ViajesPro.",
};

export default async function AuthPage({ searchParams }) {
  const sp = await searchParams;
  // Ruta a la que volver tras autenticarse (la fija el middleware). Debe ser relativa.
  const next = typeof sp?.next === "string" && sp.next.startsWith("/") ? sp.next : null;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-zinc-100 lg:grid-cols-2">
      <BrandPanel />
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <AuthCard next={next} />
      </section>
    </main>
  );
}
