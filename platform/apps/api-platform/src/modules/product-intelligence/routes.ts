import { Express } from "express";
import {
  optimizationRecommendationRecordsRepository,
  productInsightRunsRepository,
  productSignalRecordsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import { createProductInsightRunSchema } from "../../validators/product-intelligence.dto";
import { createProductInsightRun } from "../../services/productIntelligence";

export function registerProductIntelligenceRoutes(app: Express): void {
  app.get("/api/projects/:id/product-intelligence/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await productInsightRunsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/product-intelligence/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createProductInsightRunSchema), async (req, res) => {
    const item = await createProductInsightRun({
      projectId: req.params.id,
      inputMetricsJson: req.body.inputMetricsJson,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/projects/:id/product-intelligence/runs/:runId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const run = await productInsightRunsRepository.findById(req.params.runId);
    if (!run) {
      res.status(404).json({ message: "Product insight run not found" });
      return;
    }
    const signals = await productSignalRecordsRepository.listByRun(req.params.runId);
    const recommendations = await optimizationRecommendationRecordsRepository.listByRun(req.params.runId);
    res.json({ run, signals, recommendations });
  });
}
