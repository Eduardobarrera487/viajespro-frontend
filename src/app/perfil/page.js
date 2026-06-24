import { redirect } from "next/navigation";

import { PerfilPanel } from "@/components/features/perfil/PerfilPanel";
import { getMiPerfil } from "@/lib/api/perfil";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Mi perfil · ViajesPro",
  description: "Administra la información de tu cuenta en ViajesPro.",
};

export default async function PerfilPage() {
  const session = await getSession();

  if (!session?.token) {
    redirect("/auth?next=/perfil");
  }

  let perfil = session.usuario || session.user || null;
  let apiError = null;

  const res = await getMiPerfil();

  if (res.ok) {
    perfil = res.data?.usuario ?? res.data?.Usuario ?? res.data ?? perfil;
  } else {
    apiError = "No se pudo cargar el perfil actualizado desde la API. Se muestra la información de la sesión actual.";
  }

  return <PerfilPanel perfil={perfil} apiError={apiError} />;
}
