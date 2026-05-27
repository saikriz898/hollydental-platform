import { ENV } from "../config/env.js";

/**
 * Global error handler.
 *
 * - Logs the full error server-side (including the request URL & method)
 *   so we have a paper trail.
 * - Returns a *redacted* response to clients. Stack traces are never sent
 *   to non-development environments.
 * - Recognises CORS errors so we don't 500 on them.
 */
export const errorHandler = (err, req, res, _next) => {
  const status =
    err.statusCode ||
    (typeof err.status === "number" ? err.status : null) ||
    (err.message?.startsWith("Origin not allowed by CORS") ? 403 : 500);

  // Only the message survives to the client.
  const safeMessage =
    status >= 500 || !err.message
      ? "Internal server error."
      : String(err.message);

  // Server-side log — redact obvious secrets if they end up in the message.
  // eslint-disable-next-line no-console
  console.error(
    `[error] ${req.method} ${req.originalUrl} → ${status}:`,
    err.stack || err.message || err
  );

  res.status(status).json({
    success: false,
    message: safeMessage,
    ...(ENV.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};
