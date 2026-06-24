/**
 * Galería de imágenes del viaje.
 *
 * ⚠️ El API no almacena imágenes todavía, así que usamos placeholders estables
 * (picsum, sembrados por viajeId) para mantener el diseño. Cuando el API exponga
 * URLs reales, reemplaza `placeholder()` por las imágenes del viaje.
 *
 * @param {{ viajeId: number, titulo: string }} props
 */
export function Gallery({ viajeId, titulo }) {
  const placeholder = (n, w, h) =>
    `https://picsum.photos/seed/viaje-${viajeId}-${n}/${w}/${h}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr]">
      <div className="overflow-hidden rounded-3xl bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={placeholder(1, 900, 800)}
          alt={`${titulo} — imagen principal`}
          className="h-72 w-full object-cover sm:h-[26rem]"
          loading="eager"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[2, 3, 4, 5].map((n, i) => (
          <div key={n} className="relative overflow-hidden rounded-3xl bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={placeholder(n, 500, 500)}
              alt={`${titulo} — imagen ${n}`}
              className="h-[8.25rem] w-full object-cover sm:h-[12.5rem]"
              loading="lazy"
            />
            {i === 3 ? (
              <button
                type="button"
                className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
              >
                Ver todas las fotos
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
