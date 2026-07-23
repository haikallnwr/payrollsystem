import type { Request, Response, NextFunction } from "express";
import { ResponseError } from "../lib/error";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { getDetailToken } from "./jwt";

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

  console.error("Unhandled error:", err);

  res.status(500).json({
    code: 500,
    message: "Internal server error",
  });
}

export const verifyJsonWebToken = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (header === null) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized Access",
    });
  }

  jwt.verify(header ?? "", process.env.APP_SECRET ?? "", (err) => {
    if (err) {
      return res.status(403).json({
        code: 401,
        message: "Forbidden, token invalid",
      });
    }

    next();
  });
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (header == null) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized Access",
    });
  }

  jwt.verify(header ?? "", process.env.APP_SECRET ?? "", (err) => {
    if (err) {
      return res.status(403).json({
        code: 401,
        message: "Forbidden, token invalid",
      });
    }
  });

  const decode = await getDetailToken(header);
  if (decode.role !== "ADMIN" && decode.role !== "HR") {
    return res.status(403).json({
      code: 401,
      message: "You dont have access",
    });
  }

  next();
};
