import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";

export function registerDeveloperRoutes(app: Express): void {

  app.get("/api/developer/profile", requireAuth, async (req, res) => {
    res.json({
      userId: req.user?.id,
      role: "developer"
    });
  });

  app.get("/api/developer/api-keys", requireAuth, async (_req, res) => {
    res.json([]);
  });

  app.post("/api/developer/api-keys", requireAuth, async (_req, res) => {
    res.json({ created: true });
  });

  app.get("/api/developer/webhooks", requireAuth, async (_req, res) => {
    res.json([]);
  });

}
