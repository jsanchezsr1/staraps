export type CopilotMessageRole = "system" | "user" | "assistant";

export type CopilotMessage = {
  role: CopilotMessageRole;
  content: string;
};

export type CopilotSuggestionType =
  | "model"
  | "page"
  | "api"
  | "workflow"
  | "fix"
  | "diagnostic";

export type CopilotSuggestion = {
  type: CopilotSuggestionType;
  title: string;
  description: string;
  patchJson?: Record<string, unknown>;
};
