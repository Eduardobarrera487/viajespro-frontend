import { NextResponse } from "next/server";

/**
 * Proxy de imágenes/documentos del API. El navegador pide `/api/imagen?path=/uploads/...`
 * (mismo origen que el front, HTTPS) y este handler lo trae del API server-side (HTTP ok).
 * Evita mixed content cuando el API no tiene HTTPS.
 *
 * Seguridad: solo se permiten rutas `/uploads/...` (no proxy abierto / SSRF).
 */
export async function GET(request) {
  const path = new URL(request.url).searchParams.get("path");

  if (!path || !path.startsWith("/uploads/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const base = (process.env.API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!base) return new NextResponse("Misconfig", { status: 500 });

  try {
    const upstream = await fetch(`${base}${path}`, {
      headers: { "X-API-KEY": process.env.API_KEY ?? "" },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return new NextResponse("Not found", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Upstream error", { status: 502 });
  }
}
