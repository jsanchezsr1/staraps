import type { AgentStep } from "./types";

export async function planAgentRun(input: {
  prompt: string;
}) : Promise<AgentStep[]> {
  return [
    {
      type: "reasoning",
      title: "Analyze user prompt"
    },
    {
      type: "prompt",
      title: "Generate plan from prompt"
    }
  ];
}
