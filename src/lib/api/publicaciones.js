import "server-only";

import { getSession } from "@/lib/auth/session";

function getConfig() {
  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Faltan API_BASE_URL o API_KEY en el entorno. Revisa tu .env.local.");
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    apiKey,
  };
}

async function parseBody(res) {
  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();

  if (!text) return null;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

async function apiRequest(path, { method = "GET", body, token, json = false } = {}) {
  const { baseUrl, apiKey } = getConfig();

  const headers = {
    "X-API-KEY": apiKey,
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(json ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: json && body !== undefined ? JSON.stringify(body) : body,
    cache: "no-store",
  });

  const data = await parseBody(res);
  return { ok: res.ok, status: res.status, data };
}

export async function getCatalogosPublicacion() {
  const session = await getSession();
  return apiRequest("/api/PublicacionesViajes/catalogos", {
    token: session?.token,
  });
}

export async function crearPublicacionViaje(formData) {
  const session = await getSession();
  return apiRequest("/api/PublicacionesViajes", {
    method: "POST",
    body: formData,
    token: session?.token,
  });
}

export async function getMisPublicaciones() {
  const session = await getSession();
  return apiRequest("/api/PublicacionesViajes/mis-viajes", {
    token: session?.token,
  });
}

export async function getPublicacionesAdmin() {
  const session = await getSession();
  return apiRequest("/api/PublicacionesViajes/admin", {
    token: session?.token,
  });
}

export async function cambiarEstadoPublicacion(viajeId, activo, motivo) {
  const session = await getSession();
  return apiRequest(`/api/PublicacionesViajes/${viajeId}/estado`, {
    method: "PUT",
    token: session?.token,
    json: true,
    // El backend exige `motivo` al pausar (activo=false).
    body: { activo, motivo },
  });
}
