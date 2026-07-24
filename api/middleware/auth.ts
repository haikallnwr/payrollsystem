import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";
import type { TokenPayload } from "./jwt";
import { TOKEN_COOKIE_NAME } from "../lib/cookie";

/**
 * Extracts the JWT from the HttpOnly cookie, verifies it, and attaches the
 * decoded payload to `res.locals.user` for downstream handlers.
 *
 * Falls back to the `Authorization` header (without `Bearer ` prefix) for
 * backwards compatibility with API clients that don't use cookies.
 *
 * Responds with 401 if no token is present or if verification fails.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      code: 401,
      message: "Unauthorized — no token provided",
    });
    return;
  }

  try {
    const payload: TokenPayload = verifyToken(token);
    res.locals.user = payload;
    next();
  } catch {
    res.status(401).json({
      code: 401,
      message: "Unauthorized — invalid or expired token",
    });
  }
}

/**
 * Extends `authenticate` with a role-based gate.
 * Only users whose role is `ADMIN` or `HR` may proceed.
 */
export function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // First run the authentication step.
  authenticate(req, res, (err?: unknown) => {
    if (err) {
      next(err);
      return;
    }

    // If `authenticate` already sent a response (401), stop here.
    if (res.headersSent) {
      return;
    }

    const user = res.locals.user as TokenPayload | undefined;
    if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
      res.status(403).json({
        code: 403,
        message: "Forbidden — insufficient privileges",
      });
      return;
    }

    next();
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the token from the request.
 * Priority: HttpOnly cookie → Authorization header (backwards compat).
 */
function extractToken(req: Request): string | undefined {
  // Primary: HttpOnly cookie
  const cookieToken: unknown = req.cookies?.[TOKEN_COOKIE_NAME];
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  // Fallback: Authorization header (no "Bearer " prefix, matching legacy behavior)
  const header = req.headers.authorization;
  if (typeof header === "string" && header.length > 0) {
    // Support both "Bearer <token>" and raw "<token>" formats.
    return header.startsWith("Bearer ") ? header.slice(7) : header;
  }

  return undefined;
}
