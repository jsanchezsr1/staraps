import { Express } from "express";
import {
  deploymentEnvironmentsRepository,
  deploymentOptimizationsRepository,
  deploymentRunsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import {
  createDeploymentPlanSchema,
  createDeploymentRunSchema,
  rollbackDeploymentRunSchema
} from "../../validators/autonomous-deployment.dto";
import {
  createDeploymentPlan,
  createDeploymentRun,
  executeDeploymentRun,
  rollbackDeploymentRun
} from "../../services/autonomousDeployment";
import { writeAuditLog } from "../../utils/audit";

export function registerAutonomousDeploymentRoutes(app: Express): void {
  app.get("/api/projects/:id/environments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await deploymentEnvironmentsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/deploy/plan", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createDeploymentPlanSchema), async (req, res) => {
    const item = await createDeploymentPlan({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      environmentType: req.body.environmentType,
      createdByUserId: req.user?.id
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "autonomous_deployment.plan.create",
      entityType: "DeploymentPlan",
      entityId: item.id
    });

    res.status(201).json(item);
  });

  app.get("/api/projects/:id/deploy/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const runs = await deploymentRunsRepository.listByProject(req.params.id);
    res.json(runs);
  });

  app.post("/api/projects/:id/deploy", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createDeploymentRunSchema), async (req, res) => {
    const run = await createDeploymentRun({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      environmentType: req.body.environmentType,
      requestedByUserId: req.user?.id
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "autonomous_deployment.run.create",
      entityType: "DeploymentRun",
      entityId: run.id
    });

    res.status(201).json(run);
  });

  app.get("/api/projects/:id/deploy/runs/:runId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const run = await deploymentRunsRepository.findById(req.params.runId);
    if (!run) {
      res.status(404).json({ message: "Deployment run not found" });
      return;
    }
    const optimizations = await deploymentOptimizationsRepository.listByRun(req.params.runId);
    res.json({ run, optimizations });
  });

  app.post("/api/projects/:id/deploy/runs/:runId/execute", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), async (req, res) => {
    const run = await executeDeploymentRun(req.params.runId);
    res.json(run);
  });

  app.post("/api/projects/:id/deploy/:runId/rollback", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), validateBody(rollbackDeploymentRunSchema), async (req, res) => {
    const run = await rollbackDeploymentRun({
      runId: req.params.runId,
      reason: req.body.reason
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "autonomous_deployment.run.rollback",
      entityType: "DeploymentRun",
      entityId: req.params.runId
    });

    res.json(run);
  });
}
