export type AutonomousRunStatus =
  | "queued"
  | "planning"
  | "executing"
  | "completed"
  | "failed";

export type AutonomousExecutionStepType =
  | "analyze_prompt"
  | "draft_spec"
  | "refine_spec"
  | "generate_app"
  | "run_validation"
  | "prepare_preview";

export type AutonomousBuildPlan = {
  objective: string;
  assumptions: string[];
  targetOutputs: string[];
  steps: {
    type: AutonomousExecutionStepType;
    title: string;
    description: string;
  }[];
};

export type AutonomousExecutionResult = {
  status: AutonomousRunStatus;
  summary: string;
  output?: Record<string, unknown>;
};
