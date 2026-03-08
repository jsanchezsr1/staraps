import { Express } from "express";
import {
  builderRegenerationTriggersRepository,
  builderSyncRunsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import {
  createBuilderSyncRunSchema,
  createRegenerationTriggerSchema
} from "../../validators/builder-sync.dto";
import {
  createBuilderRegenerationTrigger,
  createBuilderSyncRun,
  executeBuilderSyncRun
} from "../../services/builderSync";
import { writeAuditLog } from "../../utils/audit";

export function registerBuilderSyncRoutes(app: Express): void {
  app.get("/api/projects/:id/builder-sync/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const runs = await builderSyncRunsRepository.listByProject(req.params.id);
    res.json(runs);
  });

  app.post("/api/projects/:id/builder-sync/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createBuilderSyncRunSchema), async (req, res) => {
    const run = await createBuilderSyncRun({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      requestedByUserId: req.user?.id,
      sourceMode: req.body.sourceMode,
      specJson: req.body.specJson,
      canvasJson: req.body.canvasJson
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "builder_sync.run.create",
      entityType: "BuilderSyncRun",
      entityId: run.id
    });

    res.status(201).json(run);
  });

  app.get("/api/projects/:id/builder-sync/runs/:runId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const run = await builderSyncRunsRepository.findById(req.params.runId);
    if (!run) {
      res.status(404).json({ message: "Run not found" });
      return;
    }
    res.json(run);
  });

  app.post("/api/projects/:id/builder-sync/runs/:runId/execute", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), async (req, res) => {
    const existing = await builderSyncRunsRepository.findById(req.params.runId);
    if (!existing) {
      res.status(404).json({ message: "Run not found" });
      return;
    }

    const result = await executeBuilderSyncRun({
      runId: req.params.runId,
      sourceMode: existing.sourceMode,
      projectId: req.params.id,
      specJson: req.body?.specJson || {},
      canvasJson: req.body?.canvasJson || {}
    });

    res.json(result);
  });

  app.get("/api/projects/:id/builder-sync/triggers", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await builderRegenerationTriggersRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/builder-sync/triggers", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createRegenerationTriggerSchema), async (req, res) => {
    const item = await createBuilderRegenerationTrigger({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      triggerType: req.body.triggerType,
      source: req.body.source,
      payloadJson: req.body.payloadJson,
      createdByUserId: req.user?.id
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "builder_sync.trigger.create",
      entityType: "BuilderRegenerationTrigger",
      entityId: item.id
    });

    res.status(201).json(item);
  });
}
