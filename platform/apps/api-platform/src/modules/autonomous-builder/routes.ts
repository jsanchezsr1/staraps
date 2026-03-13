import { Express } from "express";
import { autonomousBuildRunsRepository, autonomousBuildStepsRepository } from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createAutonomousRunSchema } from "../../validators/autonomous-builder.dto";
import {
  createAutonomousBuildRun,
  executeAutonomousBuildRun
} from "../../services/autonomousBuilder";
import { writeAuditLog } from "../../utils/audit";

export function registerAutonomousBuilderRoutes(app: Express): void {
  app.get("/api/autonomous-builder/runs", requireAuth, async (req, res) => {
    const organizationId = String(req.query.organizationId || "");
    if (!organizationId) {
      res.status(400).json({ message: "organizationId is required" });
      return;
    }
    const runs = await autonomousBuildRunsRepository.listByOrganization(organizationId);
    res.json(runs);
  });

  app.post("/api/autonomous-builder/runs", requireAuth, validateBody(createAutonomousRunSchema), async (req, res) => {
    const run = await createAutonomousBuildRun({
      organizationId: req.body.organizationId,
      projectId: req.body.projectId,
      requestedByUserId: req.user?.id,
      prompt: req.body.prompt
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.body.organizationId,
      projectId: req.body.projectId,
      action: "autonomous_builder.run.create",
      entityType: "AutonomousBuildRun",
      entityId: run.id
    });

    res.status(201).json(run);
  });

  app.get("/api/autonomous-builder/runs/:id", requireAuth, async (req, res) => {
    const run = await autonomousBuildRunsRepository.findById(req.params.id);
    if (!run) {
      res.status(404).json({ message: "Run not found" });
      return;
    }
    const steps = await autonomousBuildStepsRepository.listByRun(req.params.id);
    res.json({ run, steps });
  });

  app.post("/api/autonomous-builder/runs/:id/execute", requireAuth, async (req, res) => {
    const run = await executeAutonomousBuildRun(req.params.id);
    res.json(run);
  });
}
