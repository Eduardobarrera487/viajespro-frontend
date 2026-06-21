"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiUnreachableError } from "@/lib/api/client";
import { createSession } from "@/lib/auth/session";
import { loginSchema, registerSchema, forgotPasswordSchema } from "@/lib/validations";

/**
 * Estado que consumen los formularios vía useActionState.
 * @typedef {import("@/lib/auth/state").AuthState} AuthState
 */

/** Extrae un mensaje legible de un cuerpo de error de la API (.NET). */
function apiErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) return data.trim();
  // ModelState: { errors: { Campo: ["msg"] } } o { Campo: ["msg"] }
  if (data && typeof data === "object") {
    const errors = data.errors ?? data;
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }
  return fallback;
}

/** Llama a /api/Auth/login y, si todo va bien, abre sesión. Devuelve error string o null. */
async function authenticate(email, password) {
  const res = await apiFetch("/api/Auth/login", {
    method: "POST",
    body: { Email: email, Password: password },
  });

  if (!res.ok) {
    return apiErrorMessage(res.data, "No se pudo iniciar sesión.");
  }

  const { token, usuario } = res.data ?? {};
  if (!token) {
    return "Respuesta inesperada de la API al iniciar sesión.";
  }

  await createSession({ token, usuario });
  return null;
}

/**
 * Server Action de inicio de sesión.
 * @param {AuthState} _prevState
 * @param {FormData} formData
 * @returns {Promise<AuthState>}
 */
export async function loginAction(_prevState, formData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: null, fieldErrors: flattenZod(parsed.error) };
  }

  try {
    const error = await authenticate(parsed.data.email, parsed.data.password);
    if (error) return { error, fieldErrors: {} };
  } catch (err) {
    return { error: networkOrGenericError(err), fieldErrors: {} };
  }

  // Éxito: fuera del try para que redirect() propague correctamente.
  redirect("/");
}

/**
 * Server Action de registro. Crea el usuario y, si se crea bien,
 * inicia sesión automáticamente y redirige a la página principal.
 * @param {AuthState} _prevState
 * @param {FormData} formData
 * @returns {Promise<AuthState>}
 */
export async function registerAction(_prevState, formData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  });

  if (!parsed.success) {
    return { error: null, fieldErrors: flattenZod(parsed.error) };
  }

  const { name, email, password } = parsed.data;

  try {
    const res = await apiFetch("/api/Auth/registro", {
      method: "POST",
      body: { Nombre: name, Email: email, Password: password },
    });

    if (!res.ok) {
      return {
        error: apiErrorMessage(res.data, "No se pudo crear la cuenta."),
        fieldErrors: {},
      };
    }

    // Registro OK → iniciar sesión automáticamente con las mismas credenciales.
    const error = await authenticate(email, password);
    if (error) {
      return {
        error: "Tu cuenta se creó, pero no pudimos iniciar sesión. Intenta entrar manualmente.",
        fieldErrors: {},
      };
    }
  } catch (err) {
    return { error: networkOrGenericError(err), fieldErrors: {} };
  }

  redirect("/");
}

/**
 * Server Action de recuperación de contraseña.
 *
 * ⚠️ La API .NET aún NO expone un endpoint de "olvidé mi contraseña". Cuando exista,
 * sustituye el bloque marcado por la llamada real (p.ej. POST /api/Auth/forgot-password).
 * Por seguridad, siempre devolvemos el mismo mensaje exista o no el correo
 * (evita enumeración de usuarios).
 *
 * @param {import("@/lib/auth/state").ForgotState} _prevState
 * @param {FormData} formData
 * @returns {Promise<import("@/lib/auth/state").ForgotState>}
 */
export async function forgotPasswordAction(_prevState, formData) {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: null, fieldErrors: flattenZod(parsed.error), success: false };
  }

  // TODO: cuando la API tenga el endpoint, llamarlo aquí dentro de try/catch.
  //   await apiFetch("/api/Auth/forgot-password", { method: "POST", body: { Email: parsed.data.email } });
  // No revelamos el resultado para no exponer qué correos existen.

  return { error: null, fieldErrors: {}, success: true };
}

/** Convierte un ZodError en { campo: primerMensaje }. */
function flattenZod(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function networkOrGenericError(err) {
  if (err instanceof ApiUnreachableError) {
    return "No pudimos conectar con el servidor. Verifica que la API esté disponible.";
  }
  return "Ocurrió un error inesperado. Inténtalo de nuevo.";
}
