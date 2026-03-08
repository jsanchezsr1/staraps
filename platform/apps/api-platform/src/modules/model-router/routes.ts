import { Express } from "express";
import {
  modelCostRecordsRepository,
  modelProvidersRepository,
  modelRouteRulesRepository,
  modelUsageLogsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import {
  createModelRouteRuleSchema,
  createModelUsageLogSchema,
  routeModelSchema
} from "../../validators/model-router.dto";
import {
  createModelRouteRule,
  createModelUsageLog,
  routeModel,
  seedModelProviders
} from "../../services/modelRouter";

export function registerModelRouterRoutes(app: Express): void {
  app.get("/api/model-router/providers", requireAuth, async (_req, res) => {
    await seedModelProviders();
    const items = await modelProvidersRepository.listAll();
    res.json(items);
  });

  app.get("/api/model-router/route-rules", requireAuth, async (_req, res) => {
    const items = await modelRouteRulesRepository.listAll();
    res.json(items);
  });

  app.post("/api/model-router/route-rules", requireAuth, validateBody(createModelRouteRuleSchema), async (req, res) => {
    const item = await createModelRouteRule({
      taskType: req.body.taskType,
      providerName: req.body.providerName,
      modelName: req.body.modelName,
      priority: req.body.priority,
      reason: req.body.reason
    });
    res.status(201).json(item);
  });

  app.post("/api/model-router/route", requireAuth, validateBody(routeModelSchema), async (req, res) => {
    const decision = await routeModel({
      taskType: req.body.taskType
    });
    res.json(decision);
  });

  app.get("/api/model-router/usage", requireAuth, async (_req, res) => {
    const items = await modelUsageLogsRepository.listAll();
    res.json(items);
  });

  app.post("/api/model-router/usage", requireAuth, validateBody(createModelUsageLogSchema), async (req, res) => {
    const item = await createModelUsageLog({
      projectId: req.body.projectId,
      taskType: req.body.taskType,
      promptTokens: req.body.promptTokens,
      completionTokens: req.body.completionTokens
    });
    res.status(201).json(item);
  });

  app.get("/api/model-router/costs", requireAuth, async (_req, res) => {
    const items = await modelCostRecordsRepository.listAll();
    res.json(items);
  });
}
