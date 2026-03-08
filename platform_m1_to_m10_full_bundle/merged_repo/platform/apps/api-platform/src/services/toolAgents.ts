import { randomUUID } from "crypto";
import { executeToolInvocations, getDefaultToolRegistry, planToolAgentRun } from "@platform/tool-agents";
import {
  agentRunsRepository,
  agentToolInvocationsRepository,
  toolRegistryRepository
} from "@platform/database";

export async function seedToolRegistry() {
  const tools = getDefaultToolRegistry();
  for (const tool of tools) {
    await toolRegistryRepository.upsert({
      id: randomUUID(),
      name: tool.name,
      description: tool.description,
      inputSchemaJson: tool.inputSchemaJson || null,
      isEnabled: true
    });
  }
}

export async function createToolAgentRun(input: {
  projectId: string;
  agentType: string;
  prompt: string;
}) {
  const plan = await planToolAgentRun({ prompt: input.prompt });

  const run = await agentRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    agentType: input.agentType,
    status: "queued",
    prompt: input.prompt
  });

  for (const step of plan) {
    await agentToolInvocationsRepository.create({
      id: randomUUID(),
      agentRunId: run.id,
      toolName: step.toolName,
      title: step.title,
      status: "queued",
      inputJson: step.inputJson || null
    })
  }

  return run;
}

export async function executeToolAgentRun(input: {
  agentRunId: string;
}) {
  const invocations = await agentToolInvocationsRepository.listByAgentRun(input.agentRunId);

  const results = await executeToolInvocations({
    agentRunId: input.agentRunId,
    invocations: invocations.map((i) => ({
      toolName: i.toolName as any,
      title: i.title,
      inputJson: (i.inputJson || {}) as any
    }))
  });

  for (let idx = 0; idx < invocations.length; idx++) {
    const result = results[idx];
    await agentToolInvocationsRepository.update(invocations[idx].id, {
      status: result.status,
      outputJson: result.outputJson || null,
      errorMessage: result.errorMessage || null
    });
  }

  return results;
}
