import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { OrganizationRole } from "@platform/database";
import { getProjectDiagnostics, getRuntimeDashboard } from "../../services/diagnostics";

export function registerDiagnosticsRoutes(app: Express): void {
  app.get("/api/projects/:id/diagnostics", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const diagnostics = await getProjectDiagnostics(req.params.id);
    res.json(diagnostics);
  });

  app.get("/api/runtime/dashboard", requireAuth, async (_req, res) => {
    const dashboard = await getRuntimeDashboard();
    res.json(dashboard);
  });

  app.get("/api/ops/dead-letter", requireAuth, async (_req, res) => {
    res.json({
      queue: "platform-dead-letter",
      items: []
    });
  });

  app.get("/api/ops/debug", requireAuth, async (_req, res) => {
    res.json({
      runtime: "ok",
      workers: "available",
      diagnostics: "enabled"
    });
  });
}
