export async function runToolExecutionJob(input: {
  agentRunId: string;
  toolName: string;
}) {
  return {
    agentRunId: input.agentRunId,
    toolName: input.toolName,
    status: "completed"
  };
}
