import { Express } from "express";
import {
  growthCampaignsRepository,
  growthExperimentsRepository,
  growthOutcomesRepository,
  trafficSourcesRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createGrowthCampaignSchema } from "../../validators/growth-engine.dto";
import { analyzeGrowthCampaign, createGrowthCampaign, seedTrafficSources } from "../../services/growthEngine";

export function registerGrowthEngineRoutes(app: Express): void {
  app.get("/api/growth/traffic-sources", requireAuth, async (_req, res) => {
    await seedTrafficSources();
    const items = await trafficSourcesRepository.listAll();
    res.json(items);
  });

  app.get("/api/growth/campaigns", requireAuth, async (_req, res) => {
    const items = await growthCampaignsRepository.listAll();
    res.json(items);
  });

  app.post("/api/growth/campaigns", requireAuth, validateBody(createGrowthCampaignSchema), async (req, res) => {
    const item = await createGrowthCampaign({
      projectId: req.body.projectId,
      name: req.body.name,
      channelType: req.body.channelType,
      objective: req.body.objective,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/growth/campaigns/:id", requireAuth, async (req, res) => {
    const campaign = await growthCampaignsRepository.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Growth campaign not found" });
      return;
    }
    const experiments = await growthExperimentsRepository.listByCampaign(req.params.id);
    const outcomes = await growthOutcomesRepository.listByCampaign(req.params.id);
    res.json({ campaign, experiments, outcomes });
  });

  app.post("/api/growth/campaigns/:id/analyze", requireAuth, async (req, res) => {
    const item = await analyzeGrowthCampaign({
      growthCampaignId: req.params.id
    });
    res.json(item);
  });
}
