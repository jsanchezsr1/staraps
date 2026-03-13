export type WorkflowStepType =
  | "agent"
  | "tool"
  | "condition"
  | "approval"
  | "deployment"
  | "notification";

export type WorkflowExecutionStatus =
  | "draft"
  | "queued"
  | "planning"
  | "running"
  | "waiting"
  | "completed"
  | "failed";

export type WorkflowDefinition = {
  name: string;
  slug: string;
  description?: string;
  steps: WorkflowStepDefinition[];
};

export type WorkflowStepDefinition = {
  key: string;
  type: WorkflowStepType;
  title: string;
  description?: string;
  configJson?: Record<string, unknown>;
};

export type WorkflowExecutionResult = {
  workflowExecutionId: string;
  status: WorkflowExecutionStatus;
  executedSteps: number;
  summary: string;
};
