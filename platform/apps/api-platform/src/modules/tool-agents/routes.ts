import { Express } from "express";
import {
  agentRunsRepository,
  agentToolInvocationsRepository,
  toolRegistryRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createToolAgentRunSchema } from "../../validators/tool-agents.dto";
import {
  createToolAgentRun,
  executeToolAgentRun,
  seedToolRegistry
} from "../../services/toolAgents";

export function registerToolAgentRoutes(app: Express): void {
  app.get("/api/agents/tools/registry", requireAuth, async (_req, res) => {
    await seedToolRegistry();
    const items = await toolRegistryRepository.listAll();
    res.json(items);
  });

  app.post("/api/projects/:id/agents/tool-runs", requireAuth, validateBody(createToolAgentRunSchema), async (req, res) => {
    const run = await createToolAgentRun({
      projectId: req.params.id,
      agentType: req.body.agentType,
      prompt: req.body.prompt
    });
    res.status(201).json(run);
  });

  app.get("/api/projects/:id/agents/tool-runs/:runId", requireAuth, async (req, res) => {
    const run = await agentRunsRepository.findById(req.params.runId);
    if (!run) {
      res.status(404).json({ message: "Agent run not found" });
      return;
    }
    const invocations = await agentToolInvocationsRepository.listByAgentRun(req.params.runId);
    res.json({ run, invocations });
  });

  app.post("/api/projects/:id/agents/tool-runs/:runId/execute", requireAuth, async (req, res) => {
    const results = await executeToolAgentRun({
      agentRunId: req.params.runId
    });
    res.json(results);
  });
}
