import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { OrganizationRole, visualBuilderPatchEventsRepository } from "@platform/database";
import { validateBody } from "../../validators/common";
import {
  createVisualBuilderPatchSchema,
  upsertVisualBuilderCanvasSchema
} from "../../validators/visual-builder.dto";
import {
  createVisualBuilderPatch,
  getOrCreateVisualBuilderCanvas,
  saveVisualBuilderCanvas
} from "../../services/visualBuilder";
import { writeAuditLog } from "../../utils/audit";

export function registerVisualBuilderRoutes(app: Express): void {
  app.get("/api/projects/:id/visual-builder/canvas", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const canvas = await getOrCreateVisualBuilderCanvas({
      projectId: req.params.id,
      projectVersionId: typeof req.query.versionId === "string" ? req.query.versionId : undefined
    });
    res.json(canvas);
  });

  app.post("/api/projects/:id/visual-builder/canvas", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(upsertVisualBuilderCanvasSchema), async (req, res) => {
    const canvas = await saveVisualBuilderCanvas({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      stateJson: req.body.stateJson
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "visual_builder.canvas.save",
      entityType: "VisualBuilderCanvas",
      entityId: canvas.id
    });

    res.status(201).json(canvas);
  });

  app.get("/api/projects/:id/visual-builder/patches", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const patches = await visualBuilderPatchEventsRepository.listByProject(req.params.id);
    res.json(patches);
  });

  app.post("/api/projects/:id/visual-builder/patches", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createVisualBuilderPatchSchema), async (req, res) => {
    const patch = await createVisualBuilderPatch({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      nodeId: req.body.nodeId,
      operation: req.body.operation,
      patchJson: req.body.patchJson,
      createdByUserId: req.user?.id
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "visual_builder.patch.create",
      entityType: "VisualBuilderPatchEvent",
      entityId: patch.id
    });

    res.status(201).json(patch);
  });
}
