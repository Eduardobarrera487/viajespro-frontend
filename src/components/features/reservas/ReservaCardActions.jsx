"use client";

import { useMemo, useState, useTransition } from "react";

import {
  registrarCompartidoAction,
  toggleLikeViajeAction,
} from "@/lib/interacciones/actions";

async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

export function ReservaCardActions({ reservaId, viajeId, titulo, initialLiked = false, shareUrl }) {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const canLike = Number.isFinite(Number(viajeId)) && Number(viajeId) > 0;

  const url = useMemo(() => {
    if (typeof window === "undefined") return shareUrl || "/reservas";
    if (shareUrl?.startsWith("http")) return shareUrl;
    if (shareUrl?.startsWith("/")) return `${window.location.origin}${shareUrl}`;
    return `${window.location.origin}/reservas`;
  }, [shareUrl]);

  function handleLike() {
    if (!canLike || pending) {
      setStatus("No se pudo identificar el viaje de esta reserva.");
      return;
    }

    const previous = liked;
    setStatus(null);
    setLiked(!previous);

    startTransition(async () => {
      const result = await toggleLikeViajeAction(viajeId);

      if (!result?.ok) {
        setLiked(previous);
        setStatus(result?.error || "No se pudo guardar el like.");
        return;
      }

      setLiked(Boolean(result.liked));
      setStatus(result.liked ? "Guardado en likes." : "Quitado de likes.");
      window.setTimeout(() => setStatus(null), 1800);
    });
  }

  async function handleShare() {
    setStatus(null);

    const shareData = {
      title: titulo || "ViajesPro",
      text: titulo ? `Mirá este viaje: ${titulo}` : "Mirá esta reserva en ViajesPro",
      url,
    };

    try {
      let shared = false;

      if (navigator?.share) {
        await navigator.share(shareData);
        shared = true;
      } else {
        shared = await copyToClipboard(url);
      }

      if (!shared) {
        setStatus("No se pudo copiar el enlace.");
        return;
      }

      setStatus(navigator?.share ? "Compartido." : "Enlace copiado.");
      window.setTimeout(() => setStatus(null), 1800);

      startTransition(async () => {
        await registrarCompartidoAction({
          reservaId,
          viajeId: canLike ? viajeId : null,
          canal: navigator?.share ? "web-share" : "clipboard",
          url,
        });
      });
    } catch (error) {
      if (error?.name === "AbortError") return;
      setStatus("No se pudo compartir. Probá copiar el enlace manualmente.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLike}
          disabled={pending}
          aria-pressed={liked}
          aria-label={liked ? "Quitar de likes" : "Agregar a likes"}
          title={liked ? "Quitar de likes" : "Agregar a likes"}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-lg font-black transition ${
            liked
              ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          } disabled:cursor-wait disabled:opacity-70`}
        >
          {liked ? "♥" : "♡"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-wait disabled:opacity-70"
        >
          <span aria-hidden="true">↗</span>
          Compartir
        </button>
      </div>

      {status ? <p className="max-w-[230px] text-xs font-semibold text-slate-500">{status}</p> : null}
    </div>
  );
}
