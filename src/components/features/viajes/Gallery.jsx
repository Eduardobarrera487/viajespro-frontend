/**
 * Imagen del viaje en el detalle. Usa la imagen real subida por el agente
 * (`imagenUrl` del API). Si no hay, muestra un placeholder neutro.
 *
 * @param {{ imagenUrl?: string | null, titulo: string }} props
 */
export function Gallery({ imagenUrl, titulo }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-slate-100">
      {imagenUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagenUrl}
          alt={titulo}
          className="h-72 w-full object-cover sm:h-[26rem]"
          loading="eager"
        />
      ) : (
        <div className="flex h-72 w-full items-center justify-center text-6xl text-slate-300 sm:h-[26rem]">
          ✈
        </div>
      )}
    </div>
  );
}
