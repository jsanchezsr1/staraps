import { randomUUID } from "crypto";
import { buildDefaultWorkflowFromPrompt, executeWorkflowDefinition } from "@platform/workflow-agents";
import {
  agentWorkflowExecutionsRepository,
  agentWorkflowsRepository,
  agentWorkflowStepsRepository
} from "@platform/database";

export async function createAgentWorkflow(input: {
  projectId: string;
  name: string;
  prompt: string;
  createdByUserId?: string;
}) {
  const workflow = await buildDefaultWorkflowFromPrompt({
    name: input.name,
    prompt: input.prompt
  });

  const record = await agentWorkflowsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    name: workflow.name,
    slug: workflow.slug,
    description: workflow.description || null,
    definitionJson: workflow,
    createdByUserId: input.createdByUserId || null
  });

  for (const step of workflow.steps) {
    await agentWorkflowStepsRepository.create({
      id: randomUUID(),
      agentWorkflowId: record.id,
      stepKey: step.key,
      stepType: step.type,
      title: step.title,
      description: step.description || null,
      configJson: step.configJson || null
    });
  }

  return record;
}

export async function executeAgentWorkflow(input: {
  workflowId: string;
  projectId: string;
  inputJson?: Record<string, unknown>;
  createdByUserId?: string;
}) {
  const workflow = await agentWorkflowsRepository.findById(input.workflowId);
  if (!workflow) throw new Error("Workflow not found");

  const execution = await agentWorkflowExecutionsRepository.create({
    id: randomUUID(),
    agentWorkflowId: workflow.id,
    projectId: input.projectId,
    status: "running",
    inputJson: input.inputJson || null,
    createdByUserId: input.createdByUserId || null,
    startedAt: new Date()
  });

  const definition = workflow.definitionJson as any;

  const result = await executeWorkflowDefinition({
    workflowExecutionId: execution.id,
    workflow: definition
  });

  await agentWorkflowExecutionsRepository.update(execution.id, {
    status: result.status,
    resultJson: result,
    finishedAt: new Date()
  });

  return agentWorkflowExecutionsRepository.findById(execution.id);
}
