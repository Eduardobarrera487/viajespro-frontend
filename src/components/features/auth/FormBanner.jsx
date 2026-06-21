/**
 * Banner de error a nivel de formulario (credenciales inválidas, fallo de red, etc.).
 * No renderiza nada si no hay mensaje.
 *
 * @param {{ children?: import('react').ReactNode }} props
 */
export function FormBanner({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
    >
      {children}
    </div>
  );
}
