export type VentureBuildRunStatus =
  | "queued"
  | "planning"
  | "spec_generating"
  | "generator_handoff"
  | "deployment_ready"
  | "completed"
  | "failed";

export type VentureBuildPlan = {
  productName: string;
  category: string;
  targetCustomer: string;
  primaryWorkflow: string;
  monetizationModel: string;
  payloadJson?: Record<string, unknown>;
};

export type VentureAppSpecDraft = {
  meta: Record<string, unknown>;
  models: Record<string, unknown>[];
  pages: Record<string, unknown>[];
  apis: Record<string, unknown>[];
};

export type VentureLaunchHandoff = {
  readiness: "draft" | "generator_ready" | "deployment_ready";
  summary: string;
  nextActions: string[];
};
