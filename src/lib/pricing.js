/**
 * Cálculo de precios de una reserva (puro — válido en cliente y servidor).
 * El API no expone impuestos; usamos una estimación transparente.
 */

export const TAX_RATE = 0.07;

/**
 * @param {number} precio - Precio por persona.
 * @param {number} viajeros - Número de viajeros.
 * @returns {{ subtotal: number, impuestos: number, seguro: number, total: number }}
 */
export function computeTotals(precio, viajeros) {
  const subtotal = (Number(precio) || 0) * (Number(viajeros) || 0);
  const impuestos = Math.round(subtotal * TAX_RATE);
  const seguro = 0;
  return { subtotal, impuestos, seguro, total: subtotal + impuestos + seguro };
}
