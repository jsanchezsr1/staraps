export type RegionHealthStatus = "healthy" | "degraded" | "down";

export type RuntimeRegionConfig = {
  key: string;
  cloud: "aws" | "gcp" | "azure" | "other";
  displayName: string;
};

export type EdgeRoutingDecision = {
  hostname: string;
  preferredRegionKey: string;
  fallbackRegionKey?: string;
  healthStatus: RegionHealthStatus;
};

export type ReconciliationIssueType =
  | "failed_deployment"
  | "orphan_preview"
  | "billing_mismatch"
  | "stuck_generation_job";
