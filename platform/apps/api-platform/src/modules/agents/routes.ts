import { Express } from "express";
import { createAgentRun } from "../../services/agents";

export function registerAgentRoutes(app: Express): void {

  app.post("/api/projects/:id/agents/run", async (req, res) => {

    const run = await createAgentRun({
      projectId: req.params.id,
      agentType: req.body.agentType,
      prompt: req.body.prompt
    });

    res.status(201).json(run);
  });

}
