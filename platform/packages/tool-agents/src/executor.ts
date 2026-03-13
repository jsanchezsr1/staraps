import type { ToolInvocation, ToolResult } from "./types";

export async function executeToolInvocations(input: {
  agentRunId: string;
  invocations: ToolInvocation[];
}) : Promise<ToolResult[]> {
  return input.invocations.map((invocation) => ({
    toolName: invocation.toolName,
    status: "completed",
    outputJson: {
      title: invocation.title,
      acknowledged: true
    }
  }));
}
