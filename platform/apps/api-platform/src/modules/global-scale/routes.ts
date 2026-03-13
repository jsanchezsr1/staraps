import { Express } from "express";
import {
  edgeRoutingRulesRepository,
  platformIncidentsRepository,
  platformServiceHealthRepository,
  regionalDeploymentsRepository,
  runtimeRegionsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import {
  createIncidentSchema,
  createRegionalDeploymentSchema,
  createRuntimeRegionSchema,
  reportServiceHealthSchema,
  upsertEdgeRoutingRuleSchema
} from "../../validators/global-scale.dto";
import {
  createPlatformIncident,
  createRegionalDeployment,
  createRuntimeRegion,
  reportPlatformServiceHealth,
  runReconciliationScaffold,
  upsertEdgeRoutingRule
} from "../../services/globalScale";
import { writeAuditLog } from "../../utils/audit";

export function registerGlobalScaleRoutes(app: Express): void {
  app.get("/api/ops/regions", requireAuth, async (_req, res) => {
    const regions = await runtimeRegionsRepository.listAll();
    res.json(regions);
  });

  app.post("/api/ops/regions", requireAuth, validateBody(createRuntimeRegionSchema), async (req, res) => {
    const region = await createRuntimeRegion(req.body);
    res.status(201).json(region);
  });

  app.get("/api/ops/routing", requireAuth, async (_req, res) => {
    const rules = await edgeRoutingRulesRepository.listAll();
    res.json(rules);
  });

  app.post("/api/ops/routing", requireAuth, validateBody(upsertEdgeRoutingRuleSchema), async (req, res) => {
    const rule = await upsertEdgeRoutingRule(req.body);
    res.status(201).json(rule);
  });

  app.get("/api/ops/health/global", requireAuth, async (_req, res) => {
    const items = await platformServiceHealthRepository.listLatest();
    res.json(items);
  });

  app.post("/api/ops/health/global", requireAuth, validateBody(reportServiceHealthSchema), async (req, res) => {
    const item = await reportPlatformServiceHealth(req.body);
    res.status(201).json(item);
  });

  app.get("/api/ops/incidents", requireAuth, async (_req, res) => {
    const items = await platformIncidentsRepository.listAll();
    res.json(items);
  });

  app.post("/api/ops/incidents", requireAuth, validateBody(createIncidentSchema), async (req, res) => {
    const item = await createPlatformIncident(req.body);
    res.status(201).json(item);
  });

  app.post("/api/ops/reconciliation/run", requireAuth, async (_req, res) => {
    const result = await runReconciliationScaffold();
    res.json(result);
  });

  app.get("/api/projects/:id/ops/regional-deployments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await regionalDeploymentsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/ops/regional-deployments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createRegionalDeploymentSchema), async (req, res) => {
    const item = await createRegionalDeployment({
      projectId: req.params.id,
      ...req.body
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "global_scale.regional_deployment.create",
      entityType: "RegionalDeployment",
      entityId: item.id
    });

    res.status(201).json(item);
  });
}
