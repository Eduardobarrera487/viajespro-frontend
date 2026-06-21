/**
 * Estado inicial que consumen los formularios de auth vía useActionState.
 * Vive fuera de actions.js porque un módulo "use server" solo puede exportar
 * funciones async (no objetos).
 *
 * @typedef {{ error: string | null, fieldErrors: Record<string, string> }} AuthState
 */

/** @type {AuthState} */
export const initialAuthState = { error: null, fieldErrors: {} };

/**
 * Estado del formulario de recuperación de contraseña.
 * @typedef {{ error: string | null, fieldErrors: Record<string, string>, success: boolean }} ForgotState
 */

/** @type {ForgotState} */
export const initialForgotState = { error: null, fieldErrors: {}, success: false };
