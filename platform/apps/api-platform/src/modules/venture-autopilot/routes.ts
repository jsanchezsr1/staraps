import { Express } from "express";
import {
  ventureAutopilotActionsRepository,
  ventureAutopilotRunsRepository,
  ventureLifecycleDecisionsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createVentureAutopilotRunSchema } from "../../validators/venture-autopilot.dto";
import { createVentureAutopilotRun } from "../../services/ventureAutopilot";

export function registerVentureAutopilotRoutes(app: Express): void {
  app.get("/api/venture-autopilot/runs", requireAuth, async (_req, res) => {
    const items = await ventureAutopilotRunsRepository.listAll();
    res.json(items);
  });

  app.post("/api/venture-autopilot/runs", requireAuth, validateBody(createVentureAutopilotRunSchema), async (req, res) => {
    const item = await createVentureAutopilotRun({
      opportunityName: req.body.opportunityName,
      marketCategory: req.body.marketCategory,
      performanceScore: req.body.performanceScore,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/venture-autopilot/runs/:id", requireAuth, async (req, res) => {
    const run = await ventureAutopilotRunsRepository.findById(req.params.id);
    if (!run) {
      res.status(404).json({ message: "Venture autopilot run not found" });
      return;
    }
    const actions = await ventureAutopilotActionsRepository.listByRun(req.params.id);
    const decisions = await ventureLifecycleDecisionsRepository.listByRun(req.params.id);
    res.json({ run, actions, decisions });
  });
}
