import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.message);

  const statusCode = err.message.includes("already in use") || err.message.includes("Invalid")
    ? 400
    : 500;

  res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
}
