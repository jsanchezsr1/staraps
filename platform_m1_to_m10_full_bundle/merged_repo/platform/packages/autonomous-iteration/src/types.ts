export type IterationRunStatus =
  | "queued"
  | "evaluating"
  | "planning"
  | "applying"
  | "regenerating"
  | "completed"
  | "failed";

export type IterationSuggestionType =
  | "add_crud"
  | "add_dashboard"
  | "add_analytics"
  | "optimize_layout"
  | "add_workflow"
  | "extend_api";

export type IterationActionType =
  | "patch_spec"
  | "create_page"
  | "create_api"
  | "create_workflow"
  | "regenerate_app";

export type IterationSuggestion = {
  type: IterationSuggestionType;
  title: string;
  description: string;
  payloadJson?: Record<string, unknown>;
  priority: "low" | "medium" | "high";
};

export type IterationAction = {
  type: IterationActionType;
  title: string;
  description: string;
  payloadJson?: Record<string, unknown>;
};
