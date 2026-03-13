import { Express } from "express";
import {
  agentWorkflowExecutionsRepository,
  agentWorkflowsRepository,
  agentWorkflowStepsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import {
  createAgentWorkflowSchema,
  executeAgentWorkflowSchema
} from "../../validators/workflow-agents.dto";
import {
  createAgentWorkflow,
  executeAgentWorkflow
} from "../../services/workflowAgents";

export function registerWorkflowAgentRoutes(app: Express): void {
  app.get("/api/projects/:id/agent-workflows", requireAuth, async (req, res) => {
    const items = await agentWorkflowsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/agent-workflows", requireAuth, validateBody(createAgentWorkflowSchema), async (req, res) => {
    const workflow = await createAgentWorkflow({
      projectId: req.params.id,
      name: req.body.name,
      prompt: req.body.prompt,
      createdByUserId: req.user?.id
    });
    res.status(201).json(workflow);
  });

  app.get("/api/projects/:id/agent-workflows/:workflowId", requireAuth, async (req, res) => {
    const workflow = await agentWorkflowsRepository.findById(req.params.workflowId);
    if (!workflow) {
      res.status(404).json({ message: "Workflow not found" });
      return;
    }
    const steps = await agentWorkflowStepsRepository.listByWorkflow(req.params.workflowId);
    res.json({ workflow, steps });
  });

  app.post("/api/projects/:id/agent-workflows/:workflowId/execute", requireAuth, validateBody(executeAgentWorkflowSchema), async (req, res) => {
    const execution = await executeAgentWorkflow({
      workflowId: req.params.workflowId,
      projectId: req.params.id,
      inputJson: req.body.inputJson,
      createdByUserId: req.user?.id
    });
    res.status(201).json(execution);
  });

  app.get("/api/projects/:id/agent-workflow-executions", requireAuth, async (req, res) => {
    const items = await agentWorkflowExecutionsRepository.listByProject(req.params.id);
    res.json(items);
  });
}
