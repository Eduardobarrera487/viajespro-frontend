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

export function ViajeActionButtons({ viajeId, titulo, initialLiked = false, shareUrl }) {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const id = Number(viajeId);
  const canLike = Number.isFinite(id) && id > 0;

  const url = useMemo(() => {
    if (typeof window === "undefined") return shareUrl || (canLike ? `/viajes/${id}` : "/");
    if (shareUrl?.startsWith("http")) return shareUrl;
    if (shareUrl?.startsWith("/")) return `${window.location.origin}${shareUrl}`;
    return `${window.location.origin}${canLike ? `/viajes/${id}` : "/"}`;
  }, [shareUrl, canLike, id]);

  function handleLike() {
    if (!canLike || pending) return;

    const previous = liked;
    setLiked(!previous);
    setStatus(null);

    startTransition(async () => {
      const result = await toggleLikeViajeAction(id);
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
    const shareData = {
      title: titulo || "ViajesPro",
      text: titulo ? `Mirá este viaje: ${titulo}` : "Mirá este viaje en ViajesPro",
      url,
    };

    try {
      if (navigator?.share) {
        await navigator.share(shareData);
      } else {
        const copied = await copyToClipboard(url);
        if (!copied) throw new Error("No se pudo copiar.");
      }

      setStatus(navigator?.share ? "Compartido." : "Enlace copiado.");
      window.setTimeout(() => setStatus(null), 1800);

      startTransition(async () => {
        await registrarCompartidoAction({
          viajeId: canLike ? id : null,
          reservaId: null,
          canal: navigator?.share ? "web-share" : "clipboard",
          url,
        });
      });
    } catch (error) {
      if (error?.name === "AbortError") return;
      setStatus("No se pudo compartir.");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <span aria-hidden="true">↗</span>
          Compartir
        </button>

        <button
          type="button"
          onClick={handleLike}
          disabled={!canLike || pending}
          aria-pressed={liked}
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-black shadow-sm transition ${
            liked
              ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
          {liked ? "Guardado" : "Guardar"}
        </button>
      </div>

      {status ? <p className="text-xs font-semibold text-slate-500">{status}</p> : null}
    </div>
  );
}
