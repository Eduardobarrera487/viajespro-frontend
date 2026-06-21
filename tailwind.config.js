/**
 * Configuración de Tailwind (cargada por `@config` en src/app/globals.css).
 *
 * En Tailwind v4 los tokens viven en el config o en `@theme`; aquí centralizamos
 * los tokens de diseño reutilizables (paleta de marca, sombra de tarjeta) para
 * no repetir colores sueltos en el JSX. Las clases de componente (.btn, .auth-card,
 * .field-input, …) se definen en globals.css con @layer components usando estos tokens.
 *
 * @type {import('tailwindcss').Config}
 */
const config = {
  theme: {
    extend: {
      colors: {
        // Marca = azul de ViajesPro. brand-600 es la acción principal.
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
        },
      },
      boxShadow: {
        card: "0 20px 40px -12px rgb(24 24 27 / 0.08)",
      },
    },
  },
};

module.exports = config;
