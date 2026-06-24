/**
 * Estado del formulario de checkout (consumido con useActionState).
 * Vive fuera de actions.js porque un módulo "use server" solo puede exportar
 * funciones async.
 *
 * @typedef {{ error: string | null, fieldErrors: Record<string, string> }} ReservaState
 */

/** @type {ReservaState} */
export const initialReservaState = { error: null, fieldErrors: {} };
