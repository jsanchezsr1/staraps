import type { AgentStep } from "./types";

export async function executeAgentSteps(input: {
  agentRunId: string;
  steps: AgentStep[];
}) {
  return {
    agentRunId: input.agentRunId,
    executedSteps: input.steps.length,
    status: "completed"
  };
}
