import { Express } from "express";
import {
  ventureBuildRunsRepository,
  ventureGeneratedProjectsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createVentureBuildRunSchema } from "../../validators/venture-builder.dto";
import { createVentureBuildRun } from "../../services/ventureBuilder";

export function registerVentureBuilderRoutes(app: Express): void {
  app.get("/api/venture-builder/runs", requireAuth, async (_req, res) => {
    const items = await ventureBuildRunsRepository.listAll();
    res.json(items);
  });

  app.post("/api/venture-builder/runs", requireAuth, validateBody(createVentureBuildRunSchema), async (req, res) => {
    const item = await createVentureBuildRun({
      ventureIdeaId: req.body.ventureIdeaId,
      ventureName: req.body.ventureName,
      marketCategory: req.body.marketCategory,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/venture-builder/runs/:id", requireAuth, async (req, res) => {
    const run = await ventureBuildRunsRepository.findById(req.params.id);
    if (!run) {
      res.status(404).json({ message: "Venture build run not found" });
      return;
    }
    const projects = await ventureGeneratedProjectsRepository.listByBuildRun(req.params.id);
    res.json({ run, projects });
  });
}
