import { BrandPanel } from "@/components/features/auth/BrandPanel";
import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";

export const metadata = {
  title: "Recuperar contraseña · ViajesPro",
  description: "Restablece la contraseña de tu cuenta de ViajesPro.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-zinc-100 lg:grid-cols-2">
      <BrandPanel />
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="auth-card">
          <header className="text-center">
            <h1 className="text-xl font-bold text-zinc-900">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Escribe tu correo y te enviaremos un enlace para restablecerla.
            </p>
          </header>

          <ForgotPasswordForm />
        </div>
      </section>
    </main>
  );
}
