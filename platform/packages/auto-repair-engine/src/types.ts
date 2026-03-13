export type RepairRunStatus =
  | "queued"
  | "diagnosing"
  | "planning"
  | "repairing"
  | "validating"
  | "completed"
  | "failed";

export type RepairDiagnosticType =
  | "missing_model"
  | "missing_api"
  | "invalid_binding"
  | "component_mismatch"
  | "schema_inconsistency"
  | "preview_failure"
  | "unknown";

export type RepairActionType =
  | "create_model"
  | "create_api"
  | "update_binding"
  | "replace_component"
  | "patch_schema"
  | "retry_preview";

export type RepairDiagnostic = {
  type: RepairDiagnosticType;
  path: string;
  message: string;
  severity: "low" | "medium" | "high";
};

export type RepairAction = {
  type: RepairActionType;
  title: string;
  description: string;
  payloadJson?: Record<string, unknown>;
};
