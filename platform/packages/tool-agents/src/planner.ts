import type { ToolInvocation } from "./types";

export async function planToolAgentRun(input: {
  prompt: string;
}) : Promise<ToolInvocation[]> {
  return [
    {
      toolName: "generator",
      title: "Check generation readiness",
      inputJson: { objective: input.prompt }
    },
    {
      toolName: "preview",
      title: "Prepare preview validation",
      inputJson: { objective: input.prompt }
    }
  ];
}
