import { Express } from "express";
import {
  experimentResultsRepository,
  experimentsRepository,
  experimentVariantsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import {
  analyzeExperimentSchema,
  createExperimentSchema
} from "../../validators/experimentation.dto";
import {
  analyzeExperiment,
  createExperiment
} from "../../services/experimentation";

export function registerExperimentationRoutes(app: Express): void {
  app.get("/api/projects/:id/experiments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await experimentsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/experiments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createExperimentSchema), async (req, res) => {
    const item = await createExperiment({
      projectId: req.params.id,
      name: req.body.name,
      targetMetric: req.body.targetMetric,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/projects/:id/experiments/:experimentId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const experiment = await experimentsRepository.findById(req.params.experimentId);
    if (!experiment) {
      res.status(404).json({ message: "Experiment not found" });
      return;
    }
    const variants = await experimentVariantsRepository.listByExperiment(req.params.experimentId);
    const results = await experimentResultsRepository.listByExperiment(req.params.experimentId);
    res.json({ experiment, variants, results });
  });

  app.post("/api/projects/:id/experiments/:experimentId/analyze", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(analyzeExperimentSchema), async (req, res) => {
    const item = await analyzeExperiment({
      experimentId: req.params.experimentId
    });
    res.json(item);
  });
}
