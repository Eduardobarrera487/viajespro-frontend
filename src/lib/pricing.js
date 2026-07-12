/**
 * Cálculo de precios de una reserva (puro — válido en cliente y servidor).
 * El backend NO cobra impuestos: el total real de la reserva es precio × viajeros.
 * No inventamos ningún cargo extra para que el total coincida con la BD.
 */

/**
 * @param {number} precio - Precio por persona.
 * @param {number} viajeros - Número de viajeros.
 * @returns {{ subtotal: number, impuestos: number, seguro: number, total: number }}
 */
export function computeTotals(precio, viajeros) {
  const subtotal = (Number(precio) || 0) * (Number(viajeros) || 0);
  return { subtotal, impuestos: 0, seguro: 0, total: subtotal };
}
