import { Express } from "express";
import {
  iterationActionRecordsRepository,
  iterationRunsRepository,
  iterationSuggestionRecordsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import { createIterationRunSchema } from "../../validators/autonomous-iteration.dto";
import { createIterationRun, executeIterationRun } from "../../services/autonomousIteration";
import { writeAuditLog } from "../../utils/audit";

export function registerAutonomousIterationRoutes(app: Express): void {
  app.get("/api/projects/:id/iterations/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const runs = await iterationRunsRepository.listByProject(req.params.id);
    res.json(runs);
  });

  app.post("/api/projects/:id/iterations/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createIterationRunSchema), async (req, res) => {
    const run = await createIterationRun({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      requestedByUserId: req.user?.id,
      contextJson: req.body.contextJson
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "autonomous_iteration.run.create",
      entityType: "IterationRun",
      entityId: run.id
    });

    res.status(201).json(run);
  });

  app.get("/api/projects/:id/iterations/runs/:runId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const run = await iterationRunsRepository.findById(req.params.runId);
    if (!run) {
      res.status(404).json({ message: "Iteration run not found" });
      return;
    }

    const suggestions = await iterationSuggestionRecordsRepository.listByRun(req.params.runId);
    const actions = await iterationActionRecordsRepository.listByRun(req.params.runId);

    res.json({ run, suggestions, actions });
  });

  app.post("/api/projects/:id/iterations/runs/:runId/execute", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), async (req, res) => {
    const run = await executeIterationRun(req.params.runId);
    res.json(run);
  });
}
