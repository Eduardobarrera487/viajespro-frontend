import "server-only";

/**
 * Cliente HTTP central para la API de Reservas (.NET).
 *
 * Toda llamada pasa por aquí para inyectar la API Key secreta (header X-API-KEY)
 * que el middleware de la API exige en cada request /api. La key vive solo en el
 * servidor — este módulo nunca debe importarse desde un Client Component
 * (`server-only` provoca un error de build si eso ocurre).
 */

function getConfig() {
  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Faltan API_BASE_URL o API_KEY en el entorno. Revisa tu .env.local.",
    );
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

/**
 * Realiza una petición a la API y devuelve { ok, status, data }.
 * `data` es el cuerpo parseado (JSON si aplica, texto en otro caso).
 * Nunca lanza por respuestas !ok — el llamador decide cómo tratarlas.
 *
 * @param {string} path - Ruta relativa, p.ej. "/api/Auth/login".
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {unknown} [options.body] - Se serializa a JSON automáticamente.
 * @param {string} [options.token] - JWT Bearer para endpoints protegidos.
 * @param {RequestInit} [options.init] - Overrides de fetch (cache, signal, etc.).
 */
export async function apiFetch(path, { method = "GET", body, token, init } = {}) {
  const { baseUrl, apiKey } = getConfig();

  const headers = {
    "X-API-KEY": apiKey,
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      ...init,
    });
  } catch (cause) {
    // Error de red: la API no responde / no está levantada.
    throw new ApiUnreachableError(cause);
  }

  const data = await parseBody(res);
  return { ok: res.ok, status: res.status, data };
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

export class ApiUnreachableError extends Error {
  constructor(cause) {
    super("No se pudo conectar con la API de reservas.");
    this.name = "ApiUnreachableError";
    this.cause = cause;
  }
}
