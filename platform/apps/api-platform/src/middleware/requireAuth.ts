import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@platform/auth";
import { env } from "@platform/shared";

function getToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice("Bearer ".length).trim();
  const cookieToken = (req as any).cookies?.platform_token;
  if (typeof cookieToken === "string" && cookieToken.length > 0) return cookieToken;
  return undefined;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const payload = verifyJwt(token, env("JWT_SECRET"));
    req.user = { id: String(payload.sub), email: typeof payload.email === "string" ? payload.email : undefined };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
