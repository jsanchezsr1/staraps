import { Express } from "express";
import { hashPassword, signJwt, verifyPassword, buildCookieOptions } from "@platform/auth";
import { generateCsrfToken, generateRefreshToken, csrfCookieOptions } from "@platform/auth/session";
import { env } from "@platform/shared";
import { usersRepository } from "@platform/database";
import { validateBody } from "../../validators/common";
import { loginSchema, registerSchema } from "../../validators/auth.dto";
import { requireAuth } from "../../middleware/requireAuth";

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/register", validateBody(registerSchema), async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const existingUser = await usersRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ message: "Email already registered" });
        return;
      }

      const user = await usersRepository.create({ email, passwordHash: await hashPassword(password), name });
      const token = signJwt({ sub: user.id, email: user.email }, env("JWT_SECRET"));
      const refreshToken = generateRefreshToken();
      const csrfToken = generateCsrfToken();
      const isProd = env("NODE_ENV", "development") === "production";

      res.cookie("platform_token", token, buildCookieOptions(isProd, process.env.COOKIE_DOMAIN));
      res.cookie("platform_refresh", refreshToken, buildCookieOptions(isProd, process.env.COOKIE_DOMAIN));
      res.cookie("platform_csrf", csrfToken, csrfCookieOptions(isProd, process.env.COOKIE_DOMAIN));

      res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token, csrfToken });
    } catch (error) {
      res.status(500).json({ message: "Failed to register", error: String(error) });
    }
  });

  app.post("/api/auth/login", validateBody(loginSchema), async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await usersRepository.findByEmail(email);
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = signJwt({ sub: user.id, email: user.email }, env("JWT_SECRET"));
      const refreshToken = generateRefreshToken();
      const csrfToken = generateCsrfToken();
      const isProd = env("NODE_ENV", "development") === "production";

      res.cookie("platform_token", token, buildCookieOptions(isProd, process.env.COOKIE_DOMAIN));
      res.cookie("platform_refresh", refreshToken, buildCookieOptions(isProd, process.env.COOKIE_DOMAIN));
      res.cookie("platform_csrf", csrfToken, csrfCookieOptions(isProd, process.env.COOKIE_DOMAIN));

      res.json({ user: { id: user.id, email: user.email, name: user.name }, token, csrfToken });
    } catch (error) {
      res.status(500).json({ message: "Failed to login", error: String(error) });
    }
  });

  app.post("/api/auth/refresh", async (req, res) => {
    const refreshToken = (req as any).cookies?.platform_refresh;
    if (!refreshToken) {
      res.status(401).json({ message: "Missing refresh token" });
      return;
    }
    const csrfToken = generateCsrfToken();
    const isProd = env("NODE_ENV", "development") === "production";
    res.cookie("platform_csrf", csrfToken, csrfCookieOptions(isProd, process.env.COOKIE_DOMAIN));
    res.json({ ok: true, csrfToken });
  });

  app.post("/api/auth/logout", requireAuth, async (_req, res) => {
    const isProd = env("NODE_ENV", "development") === "production";
    for (const name of ["platform_token", "platform_refresh", "platform_csrf"]) {
      res.clearCookie(name, { path: "/", httpOnly: name !== "platform_csrf", secure: isProd, sameSite: "lax" });
    }
    res.json({ ok: true });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });
}
