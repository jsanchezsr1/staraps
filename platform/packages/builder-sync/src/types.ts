export type BuilderSyncStatus =
  | "queued"
  | "analyzing"
  | "reconciling"
  | "regenerating"
  | "completed"
  | "failed";

export type BuilderSyncConflictType =
  | "missing_node"
  | "missing_spec_entity"
  | "property_mismatch"
  | "binding_mismatch"
  | "unknown";

export type BuilderSyncConflict = {
  type: BuilderSyncConflictType;
  path: string;
  message: string;
  resolution?: "spec_wins" | "canvas_wins" | "manual";
};

export type BuilderSyncDiffEntry = {
  path: string;
  operation: "add" | "remove" | "update";
  source: "spec" | "canvas";
  payload?: Record<string, unknown>;
};
