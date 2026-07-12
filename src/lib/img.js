/**
 * Convierte una URL de imagen/documento del API (relativa `/uploads/...` o absoluta
 * `http://host/uploads/...`) en una URL servida por el propio front:
 *   /api/imagen?path=/uploads/...
 *
 * Esto evita "mixed content": si el front está en HTTPS (Vercel) y el API en HTTP
 * (somee sin SSL), el navegador bloquearía `<img src="http://...">`. El proxy la
 * sirve por el origen del front (HTTPS). Las URLs externas (p.ej. picsum) se dejan igual.
 */
export function toProxyImage(url) {
  if (!url) return null;
  const s = String(url);
  const i = s.indexOf("/uploads/");
  if (i === -1) return s; // no es un archivo del API → dejar como está
  const path = s.slice(i); // /uploads/...
  return `/api/imagen?path=${encodeURIComponent(path)}`;
}
