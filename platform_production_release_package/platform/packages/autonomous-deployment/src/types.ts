export type DeploymentRunStatus =
  | "queued"
  | "planning"
  | "provisioning"
  | "deploying"
  | "validating"
  | "optimizing"
  | "completed"
  | "failed"
  | "rolled_back";

export type DeploymentEnvironmentType =
  | "preview"
  | "staging"
  | "production";

export type DeploymentPlanStepType =
  | "prepare_artifact"
  | "create_environment"
  | "deploy_runtime"
  | "run_validation"
  | "optimize_runtime"
  | "publish_route";

export type DeploymentPlanStep = {
  type: DeploymentPlanStepType;
  title: string;
  description: string;
};

export type DeploymentOptimizationSuggestion = {
  category: "performance" | "cost" | "reliability";
  title: string;
  description: string;
  payloadJson?: Record<string, unknown>;
};
