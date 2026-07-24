import type { CookieOptions } from "express";

/**
 * Cookie name for the access token.
 * Uses the `__Host-` prefix to enforce:
 *  - `Secure` flag (HTTPS only)
 *  - No `Domain` attribute (scoped to exact host)
 *  - `Path` must be `/`
 *
 * In development (`NODE_ENV !== "production"`), we fall back to a plain name
 * because `__Host-` requires HTTPS, which local dev servers typically lack.
 */
export const TOKEN_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-token" : "token";


const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Returns a secure `CookieOptions` object for the access-token cookie.
 *
 * Flags applied:
 *  - `httpOnly`  → prevents JavaScript access (XSS mitigation)
 *  - `secure`    → cookie sent only over HTTPS (enabled in production)
 *  - `sameSite`  → "strict" blocks cross-site cookie transmission (CSRF mitigation)
 *  - `path`      → scoped to `/api` so the cookie is not sent for static assets
 *  - `maxAge`    → auto-expires after 1 day, matching the JWT lifetime
 */
export function getTokenCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: isProduction ? "/" : "/api",
    maxAge: MAX_AGE_MS,
  };
}
