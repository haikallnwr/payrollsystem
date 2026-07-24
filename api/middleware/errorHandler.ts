import type { Request, Response, NextFunction } from "express";
import { ResponseError } from "../lib/error";
import { ZodError } from "zod";

/**
 * Global error-handling middleware.
 *
 * Catches thrown errors and maps them to consistent JSON responses.
 * Sensitive stack traces are never exposed to the client.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ResponseError) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      code: 400,
      message: "Validation failed",
      errors,
    });
    return;
  }

  // Log full error for debugging — never send it to the client.
  console.error("Unhandled error:", err);

  res.status(500).json({
    code: 500,
    message: "Internal server error",
  });
}
