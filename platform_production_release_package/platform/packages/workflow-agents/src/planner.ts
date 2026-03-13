import type { WorkflowDefinition, WorkflowStepDefinition } from "./types";

export async function buildDefaultWorkflowFromPrompt(input: {
  name: string;
  prompt: string;
}) : Promise<WorkflowDefinition> {
  const steps: WorkflowStepDefinition[] = [
    {
      key: "analyze-prompt",
      type: "agent",
      title: "Analyze Prompt",
      description: "Use an agent to interpret the build objective."
    },
    {
      key: "generate-app",
      type: "tool",
      title: "Generate Application",
      description: "Use the generator tool to create the application output.",
      configJson: { tool: "generator" }
    },
    {
      key: "prepare-preview",
      type: "tool",
      title: "Prepare Preview",
      description: "Use the preview tool to provision a preview environment.",
      configJson: { tool: "preview" }
    }
  ];

  return {
    name: input.name,
    slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    description: input.prompt,
    steps
  };
}
