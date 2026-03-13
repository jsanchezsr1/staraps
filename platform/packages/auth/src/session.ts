import crypto from "crypto";
import { buildCookieOptions } from "./index";

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function csrfCookieOptions(isProduction: boolean, domain?: string) {
  return {
    ...buildCookieOptions(isProduction, domain),
    httpOnly: false
  };
}
