import { Express } from "express";
import {
  launchAssetRecordsRepository,
  launchCampaignRecordsRepository,
  launchRunsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createLaunchRunSchema } from "../../validators/launch-engine.dto";
import { createLaunchRun } from "../../services/launchEngine";

export function registerLaunchEngineRoutes(app: Express): void {
  app.get("/api/launch/runs", requireAuth, async (_req, res) => {
    const items = await launchRunsRepository.listAll();
    res.json(items);
  });

  app.post("/api/launch/runs", requireAuth, validateBody(createLaunchRunSchema), async (req, res) => {
    const item = await createLaunchRun({
      ventureBuildRunId: req.body.ventureBuildRunId,
      productName: req.body.productName,
      audience: req.body.audience,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/launch/runs/:id", requireAuth, async (req, res) => {
    const run = await launchRunsRepository.findById(req.params.id);
    if (!run) {
      res.status(404).json({ message: "Launch run not found" });
      return;
    }
    const assets = await launchAssetRecordsRepository.listByRun(req.params.id);
    const campaigns = await launchCampaignRecordsRepository.listByRun(req.params.id);
    res.json({ run, assets, campaigns });
  });
}
