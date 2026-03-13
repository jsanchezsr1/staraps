export type ModelProviderName =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "local"
  | "custom";

export type RoutingTaskType =
  | "planning"
  | "coding"
  | "reasoning"
  | "repair"
  | "iteration"
  | "evaluation"
  | "chat"
  | "fast_task";

export type ModelProviderDefinition = {
  name: ModelProviderName;
  displayName: string;
  isEnabled: boolean;
  models: string[];
};

export type ModelRouteDecision = {
  providerName: ModelProviderName;
  modelName: string;
  reason: string;
};

export type ModelUsageSummary = {
  providerName: ModelProviderName;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalCostUsd: number;
};
