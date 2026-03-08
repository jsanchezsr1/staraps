export type PromptTemplateCategory =
  | "system"
  | "agent"
  | "workflow"
  | "evaluation"
  | "repair"
  | "iteration";

export type PromptRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type PromptEvaluationScore = {
  relevance: number;
  accuracy: number;
  structure: number;
  safety: number;
};

export type PromptTemplateDefinition = {
  name: string;
  slug: string;
  category: PromptTemplateCategory;
  description?: string;
  body: string;
};

export type PromptEvaluationResult = {
  status: PromptRunStatus;
  summary: string;
  score: PromptEvaluationScore;
};
