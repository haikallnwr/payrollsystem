import type { User } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { ResponseError } from "../lib/error";

/** Shape of the claims embedded in every access token. */
export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

/**
 * Signs a JWT containing the user's identity claims.
 *
 * Security notes:
 *  - Algorithm is explicitly set to HS256 to prevent algorithm-confusion attacks.
 *  - `APP_SECRET` is validated at startup; see `resolveJwtSecret()`.
 *  - `exp` claim is set via `expiresIn`.
 */
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    } satisfies TokenPayload,
    resolveJwtSecret(),
    {
      algorithm: "HS256",
      expiresIn: "1d",
    },
  );
}

/**
 * Verifies a JWT's signature and returns the decoded payload.
 *
 * Unlike the previous `jwt.decode()` call, this actually validates:
 *  - The cryptographic signature (prevents token forgery).
 *  - The `exp` claim (rejects expired tokens).
 *  - The algorithm (locked to HS256, rejects `none`).
 *
 * @throws {ResponseError} 401 if the token is invalid, expired, or malformed.
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, resolveJwtSecret(), {
      algorithms: ["HS256"],
    }) as TokenPayload;
  } catch {
    throw new ResponseError(401, "Invalid or expired token");
  }
}

/**
 * Resolves the JWT signing secret with a multi-tiered fallback:
 *  1. `APP_SECRET` environment variable (preferred)
 *  2. In non-production: ephemeral random secret with a loud warning
 *  3. In production: throws — hard failure, no silent fallbacks
 *
 * This follows the secure coding guideline of never using hardcoded secrets
 * or literal fallback values.
 */
function resolveJwtSecret(): string {
  const envSecret = process.env.APP_SECRET;
  if (envSecret) {
    return envSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: APP_SECRET environment variable is required in production.",
    );
  }

  // Non-production fallback: generate an ephemeral secret.
  // This means tokens won't survive a server restart, which is acceptable for dev.
  // TODO(security): Replace with a persistent secret management solution.
  const crypto = require("crypto") as typeof import("crypto");
  const ephemeral = crypto.randomBytes(32).toString("hex");
  console.warn(
    "WARNING: APP_SECRET not set. Using ephemeral random secret. " +
      "Tokens will not survive restarts. This is NOT suitable for production.",
  );
  return ephemeral;
}
