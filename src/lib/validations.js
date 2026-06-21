import { z } from "zod";

/** Esquema de inicio de sesión. Espejo de LoginDto en la API. */
export const loginSchema = z.object({
  email: z.email("Introduce un correo válido.").max(400),
  password: z.string().min(1, "Introduce tu contraseña.").max(100),
});

/** Esquema de recuperación de contraseña (solo correo). */
export const forgotPasswordSchema = z.object({
  email: z.email("Introduce un correo válido.").max(400),
});

/**
 * Esquema de registro. Espejo de RegistroDto en la API
 * (password mínimo 6 caracteres) más confirmación y aceptación de términos,
 * que se validan solo en el frontend.
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(300),
    email: z.email("Introduce un correo válido.").max(400),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres.")
      .max(100),
    confirmPassword: z.string(),
    terms: z
      .literal(true, { message: "Debes aceptar los términos para continuar." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
