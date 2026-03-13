import type { ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid request body", issues: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}
