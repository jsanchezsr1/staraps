import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { runtimeScaleDeploySchema, runtimeScalePreviewSchema } from "../../validators/runtime.dto";
import { previewRoutingRepository } from "@platform/database";
import { makeHealthReport } from "@platform/shared/health";

export function registerRuntimeRoutes(app: Express): void {
  app.get("/api/runtime/health", requireAuth, async (_req, res) => {
    res.json(makeHealthReport({
      service: "runtime",
      status: "ok",
      checks: [
        { name: "routing", status: "ok" },
        { name: "providers", status: "ok" }
      ]
    }));
  });

  app.get("/api/runtime/routes", requireAuth, async (_req, res) => {
    const routes = await previewRoutingRepository.listAll();
    res.json(routes);
  });

  app.post("/api/runtime/preview-target", requireAuth, validateBody(runtimeScalePreviewSchema), async (req, res) => {
    res.status(201).json({ ok: true, target: req.body });
  });

  app.post("/api/runtime/deployment-target", requireAuth, validateBody(runtimeScaleDeploySchema), async (req, res) => {
    res.status(201).json({ ok: true, target: req.body });
  });
}
