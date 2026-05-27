const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  payload: unknown;
  /** Optional Retry-After delay in milliseconds (for 429 responses). */
  retryAfterMs?: number;
  constructor(
    message: string,
    status: number,
    payload: unknown,
    retryAfterMs?: number
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
    this.retryAfterMs = retryAfterMs;
  }
}

/* ---------------- Session bus ---------------- */

type SessionEvent = "expired";
const sessionListeners = new Set<(e: SessionEvent) => void>();

/**
 * Subscribe to global session events emitted by the API layer
 * (e.g. when a 401 is received). Returns an unsubscribe fn.
 */
export function onSessionEvent(listener: (e: SessionEvent) => void) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

function emitSession(e: SessionEvent) {
  sessionListeners.forEach((fn) => {
    try {
      fn(e);
    } catch {
      /* listener errors must not break api flow */
    }
  });
}

/* ---------------- Helpers ---------------- */

async function parseResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function parseRetryAfter(headerValue: string | null): number | undefined {
  if (!headerValue) return undefined;
  const seconds = Number(headerValue);
  if (!Number.isNaN(seconds) && seconds >= 0) return seconds * 1000;
  // HTTP-date form
  const ts = Date.parse(headerValue);
  if (!Number.isNaN(ts)) {
    const diff = ts - Date.now();
    return diff > 0 ? diff : 0;
  }
  return undefined;
}

/**
 * Paths we should NEVER react to with auto-logout (otherwise we'd loop:
 * `/auth/me` failing -> emit expired -> auth tries to refetch /auth/me).
 */
const SESSION_SAFE_PATHS = ["/auth/login", "/auth/register", "/auth/me"];

function isSessionSafe(path: string) {
  return SESSION_SAFE_PATHS.some((p) => path.startsWith(p));
}

/* ---------------- Public API ---------------- */

export interface ApiRequestOptions extends RequestInit {
  /** Set to true to suppress the global session-expired event on 401. */
  silentAuth?: boolean;
}

/**
 * JSON request helper. Sends/expects application/json, includes httpOnly cookies.
 * Throws ApiError on non-2xx so the UI can render real empty / error states.
 */
export async function apiRequest(path: string, options: ApiRequestOptions = {}) {
  const { silentAuth, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(rest.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && (data as any).message) ||
      `Request failed with status ${res.status}`;
    const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));

    if (res.status === 401 && !silentAuth && !isSessionSafe(path)) {
      emitSession("expired");
    }

    throw new ApiError(message as string, res.status, data, retryAfterMs);
  }

  return data;
}

/**
 * Multipart upload helper for binary content (X-rays, scans, consent PDFs, etc.).
 * Pass a real File from <input type="file">.
 */
export async function apiUpload(
  path: string,
  fields: Record<string, string | Blob>,
  options: ApiRequestOptions = {}
) {
  const { silentAuth, ...rest } = options;
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    method: rest.method || "POST",
    credentials: "include",
    body: form,
  });

  const data = await parseResponse(res);
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && (data as any).message) ||
      `Upload failed with status ${res.status}`;
    const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));

    if (res.status === 401 && !silentAuth && !isSessionSafe(path)) {
      emitSession("expired");
    }

    throw new ApiError(message as string, res.status, data, retryAfterMs);
  }
  return data;
}
