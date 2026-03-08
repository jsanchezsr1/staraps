import { Express } from "express";
import {
  collaborationActivityRepository,
  collaborationCommentsRepository,
  collaborationPresenceRepository,
  collaborationSessionsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import {
  collaborationPresenceSchema,
  createCommentSchema,
  startCollaborationSessionSchema
} from "../../validators/collaboration.dto";
import {
  createCollaborationComment,
  resolveCollaborationComment,
  startCollaborationSession,
  updateCollaborationPresence
} from "../../services/collaboration";
import { writeAuditLog } from "../../utils/audit";

export function registerCollaborationRoutes(app: Express): void {
  app.get("/api/projects/:id/collaboration/sessions", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const sessions = await collaborationSessionsRepository.listActiveByProject(req.params.id);
    res.json(sessions);
  });

  app.post("/api/projects/:id/collaboration/sessions", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(startCollaborationSessionSchema), async (req, res) => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const session = await startCollaborationSession({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      userId: req.user.id
    });

    await writeAuditLog({
      actorUserId: req.user.id,
      projectId: req.params.id,
      action: "collaboration.session.start",
      entityType: "CollaborationSession",
      entityId: session.id
    });

    res.status(201).json(session);
  });

  app.post("/api/collaboration/sessions/:id/presence", requireAuth, validateBody(collaborationPresenceSchema), async (req, res) => {
    const presence = await updateCollaborationPresence({
      sessionId: req.params.id,
      status: req.body.status,
      cursorJson: req.body.cursorJson,
      selectedNodeId: req.body.selectedNodeId
    });
    res.status(201).json(presence);
  });

  app.get("/api/projects/:id/collaboration/presence", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const presence = await collaborationPresenceRepository.listByProject(req.params.id);
    res.json(presence);
  });

  app.get("/api/projects/:id/collaboration/comments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const comments = await collaborationCommentsRepository.listByProject(req.params.id);
    res.json(comments);
  });

  app.post("/api/projects/:id/collaboration/comments", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createCommentSchema), async (req, res) => {
    const comment = await createCollaborationComment({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      createdByUserId: req.user?.id,
      targetType: req.body.targetType,
      targetId: req.body.targetId,
      body: req.body.body
    });
    res.status(201).json(comment);
  });

  app.post("/api/projects/:id/collaboration/comments/:commentId/resolve", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), async (req, res) => {
    const comment = await resolveCollaborationComment({
      commentId: req.params.commentId,
      projectId: req.params.id,
      userId: req.user?.id
    });
    res.json(comment);
  });

  app.get("/api/projects/:id/collaboration/activity", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const events = await collaborationActivityRepository.listByProject(req.params.id);
    res.json(events);
  });
}
