import { Express } from "express";
import {
  repairActionRecordsRepository,
  repairDiagnosticRecordsRepository,
  repairRunsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import { createRepairRunSchema } from "../../validators/auto-repair.dto";
import { createRepairRun, executeRepairRun } from "../../services/autoRepair";
import { writeAuditLog } from "../../utils/audit";

export function registerAutoRepairRoutes(app: Express): void {
  app.get("/api/projects/:id/repairs/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const runs = await repairRunsRepository.listByProject(req.params.id);
    res.json(runs);
  });

  app.post("/api/projects/:id/repairs/runs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createRepairRunSchema), async (req, res) => {
    const run = await createRepairRun({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      requestedByUserId: req.user?.id,
      diagnostics: req.body.diagnostics
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "auto_repair.run.create",
      entityType: "RepairRun",
      entityId: run.id
    });

    res.status(201).json(run);
  });

  app.get("/api/projects/:id/repairs/runs/:runId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const run = await repairRunsRepository.findById(req.params.runId);
    if (!run) {
      res.status(404).json({ message: "Repair run not found" });
      return;
    }

    const diagnostics = await repairDiagnosticRecordsRepository.listByRun(req.params.runId);
    const actions = await repairActionRecordsRepository.listByRun(req.params.runId);

    res.json({ run, diagnostics, actions });
  });

  app.post("/api/projects/:id/repairs/runs/:runId/execute", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), async (req, res) => {
    const run = await executeRepairRun(req.params.runId);
    res.json(run);
  });
}
