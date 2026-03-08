import { NextFunction, Request, Response } from "express";

export function requireCsrf(req: Request, res: Response, next: NextFunction): void {
  const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);
  if (safeMethods.has(req.method.toUpperCase())) {
    next();
    return;
  }
  const cookieToken = (req as any).cookies?.platform_csrf;
  const headerToken = req.headers["x-csrf-token"];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ message: "Invalid CSRF token" });
    return;
  }
  next();
}
