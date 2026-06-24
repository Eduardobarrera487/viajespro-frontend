"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { actualizarMiPerfil, cambiarPasswordPerfil } from "@/lib/api/perfil";
import { createSession, getSession } from "@/lib/auth/session";

function apiErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) return data.trim();

  if (data && typeof data === "object") {
    const errors = data.errors ?? data;

    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }

  return fallback;
}

function getValues(formData) {
  return {
    nombre: String(formData.get("nombre") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    telefono: String(formData.get("telefono") || "").trim(),
  };
}

export async function actualizarPerfilAction(_prevState, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth?next=/perfil");

  const values = getValues(formData);
  const fieldErrors = {};

  if (!values.nombre) fieldErrors.nombre = "El nombre es obligatorio.";
  if (!values.email) fieldErrors.email = "El correo es obligatorio.";
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    fieldErrors.email = "El correo no tiene un formato válido.";
  }

  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: null, success: null, fieldErrors, values };
  }

  const res = await actualizarMiPerfil({
    Nombre: values.nombre,
    Email: values.email,
    Telefono: values.telefono || null,
  });

  if (!res.ok) {
    return {
      ok: false,
      error: apiErrorMessage(res.data, "No se pudo actualizar el perfil."),
      success: null,
      fieldErrors: {},
      values,
    };
  }

  const usuarioActualizado = res.data?.usuario ?? res.data?.Usuario ?? res.data;

  await createSession({
    token: session.token,
    usuario: {
      ...(session.usuario || session.user || {}),
      ...usuarioActualizado,
    },
  });

  revalidatePath("/");
  revalidatePath("/perfil");
  revalidatePath("/reservas");

  return {
    ok: true,
    error: null,
    success: "Perfil actualizado correctamente.",
    fieldErrors: {},
    values: {
      nombre: usuarioActualizado?.nombre ?? usuarioActualizado?.Nombre ?? values.nombre,
      email: usuarioActualizado?.email ?? usuarioActualizado?.Email ?? values.email,
      telefono: usuarioActualizado?.telefono ?? usuarioActualizado?.Telefono ?? values.telefono,
    },
  };
}

export async function cambiarPasswordAction(_prevState, formData) {
  const session = await getSession();
  if (!session?.token) redirect("/auth?next=/perfil");

  const passwordActual = String(formData.get("passwordActual") || "");
  const passwordNueva = String(formData.get("passwordNueva") || "");
  const confirmarPassword = String(formData.get("confirmarPassword") || "");

  const fieldErrors = {};

  if (!passwordActual) fieldErrors.passwordActual = "Escribí tu contraseña actual.";
  if (!passwordNueva) fieldErrors.passwordNueva = "Escribí la nueva contraseña.";
  if (passwordNueva && passwordNueva.length < 6) {
    fieldErrors.passwordNueva = "La nueva contraseña debe tener al menos 6 caracteres.";
  }
  if (passwordNueva !== confirmarPassword) {
    fieldErrors.confirmarPassword = "Las contraseñas no coinciden.";
  }

  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: null, success: null, fieldErrors };
  }

  const res = await cambiarPasswordPerfil({
    PasswordActual: passwordActual,
    PasswordNueva: passwordNueva,
  });

  if (!res.ok) {
    return {
      ok: false,
      error: apiErrorMessage(res.data, "No se pudo cambiar la contraseña."),
      success: null,
      fieldErrors: {},
    };
  }

  return {
    ok: true,
    error: null,
    success: "Contraseña actualizada correctamente.",
    fieldErrors: {},
  };
}
