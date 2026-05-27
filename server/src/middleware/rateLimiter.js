import rateLimit from "express-rate-limit";

const isProd = process.env.NODE_ENV === "production";

/**
 * Always-on global limiter. Even in dev we want to catch runaway loops; just
 * with a much higher ceiling so background polling and HMR reloads don't
 * trip it.
 *
 * The dev cap is intentionally generous because the client polls several
 * endpoints every 10–30 seconds (messages, appointments, notifications)
 * and React 18 strict-mode double-renders effectively double the request
 * count from any given dev client.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 600 : 10000,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for OPTIONS preflight in both envs and for health
  // checks so monitors don't burn the budget.
  skip: (req) =>
    req.method === "OPTIONS" || req.path === "/health" || req.path === "/api/health",
});

/** Stricter limiter for auth endpoints to slow down brute-force attempts. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 15 : 200,
  message: {
    message:
      "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Stricter limiter for AI endpoints (Gemini) so we don't burn quota. */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 12 : 60,
  message: {
    message: "Too many AI requests, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
