import { randomUUID } from "crypto";
import { planAgentRun, executeAgentSteps } from "@platform/agent-runtime";
import { agentRunsRepository } from "@platform/database";

export async function createAgentRun(input) {
  const steps = await planAgentRun({ prompt: input.prompt });

  const run = await agentRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    agentType: input.agentType,
    status: "queued",
    prompt: input.prompt
  });

  return { run, steps };
}

export async function executeAgentRun(input) {
  const result = await executeAgentSteps({
    agentRunId: input.agentRunId,
    steps: input.steps
  });

  return result;
}
