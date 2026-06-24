/**
 * Utilidades de formato (puras — válidas en cliente y servidor).
 */

/** Formatea un importe como USD. `1780` → `"$1,780"`. */
export function formatCurrency(amount, { decimals = 0 } = {}) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const DAY_FMT = new Intl.DateTimeFormat("es", { day: "numeric", timeZone: "UTC" });
const MONTH_FMT = new Intl.DateTimeFormat("es", { month: "short", timeZone: "UTC" });

function cap(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function dayLabel(date) {
  const day = DAY_FMT.format(date);
  const month = cap(MONTH_FMT.format(date).replace(".", ""));
  return `${day} ${month}`;
}

/** `"15 Oct - 19 Oct 2024"` a partir de dos fechas ISO. */
export function formatDateRange(start, end) {
  if (!start) return null;
  const startDate = new Date(start);
  if (!end) return `${dayLabel(startDate)} ${startDate.getUTCFullYear()}`;
  const endDate = new Date(end);
  return `${dayLabel(startDate)} - ${dayLabel(endDate)} ${endDate.getUTCFullYear()}`;
}

/** `"15 Oct 2024"` a partir de una fecha ISO. */
export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return `${dayLabel(date)} ${date.getUTCFullYear()}`;
}

/** Número de noches entre dos fechas ISO (o null si falta alguna). */
export function nightsBetween(start, end) {
  if (!start || !end) return null;
  const diff = new Date(end) - new Date(start);
  return Math.max(0, Math.round(diff / 86_400_000));
}
