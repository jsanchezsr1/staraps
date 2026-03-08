import { Express } from "express";
import {
  ventureCreationRunsRepository,
  ventureIdeasRepository,
  venturePortfolioRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createVentureRunSchema } from "../../validators/venture-studio.dto";
import { createVentureRun } from "../../services/ventureStudio";

export function registerVentureStudioRoutes(app: Express): void {
  app.get("/api/venture-studio/runs", requireAuth, async (_req, res) => {
    const items = await ventureCreationRunsRepository.listAll();
    res.json(items);
  });

  app.post("/api/venture-studio/runs", requireAuth, validateBody(createVentureRunSchema), async (req, res) => {
    const item = await createVentureRun({
      opportunityName: req.body.opportunityName,
      marketCategory: req.body.marketCategory,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/venture-studio/ideas", requireAuth, async (_req, res) => {
    const items = await ventureIdeasRepository.listAll();
    res.json(items);
  });

  app.get("/api/venture-studio/portfolio", requireAuth, async (_req, res) => {
    const items = await venturePortfolioRepository.listAll();
    res.json(items);
  });
}
