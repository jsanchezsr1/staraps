import type { ModelRouteDecision, RoutingTaskType } from "./types";

export async function routeModelForTask(input: {
  taskType: RoutingTaskType;
}) : Promise<ModelRouteDecision> {
  switch (input.taskType) {
    case "planning":
      return {
        providerName: "openai",
        modelName: "gpt-4o",
        reason: "High-quality planning route"
      };
    case "coding":
      return {
        providerName: "anthropic",
        modelName: "claude-sonnet",
        reason: "Code-heavy task route"
      };
    case "reasoning":
      return {
        providerName: "google",
        modelName: "gemini-pro",
        reason: "Reasoning-intensive route"
      };
    case "fast_task":
      return {
        providerName: "openai",
        modelName: "gpt-4o-mini",
        reason: "Low-latency route"
      };
    default:
      return {
        providerName: "openai",
        modelName: "gpt-4o-mini",
        reason: "Default fallback route"
      };
  }
}
