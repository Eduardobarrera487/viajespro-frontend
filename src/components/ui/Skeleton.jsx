/**
 * Bloque de carga (placeholder animado). Reutilizable en cualquier loading.js.
 *
 * @param {{ className?: string }} props
 */
export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} aria-hidden />
  );
}
