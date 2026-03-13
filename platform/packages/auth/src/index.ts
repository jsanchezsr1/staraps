import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type PlatformRole = "OWNER" | "ADMIN" | "DEVELOPER" | "VIEWER";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload: Record<string, unknown>, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: "7d", issuer: "platform", audience: "platform-users" });
}

export function verifyJwt(token: string, secret: string): Record<string, unknown> {
  return jwt.verify(token, secret, { issuer: "platform", audience: "platform-users" }) as Record<string, unknown>;
}

export function buildCookieOptions(isProduction: boolean, domain?: string) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: domain || undefined
  };
}
