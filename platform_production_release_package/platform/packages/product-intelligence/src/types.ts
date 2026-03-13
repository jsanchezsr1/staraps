export type ProductInsightRunStatus =
  | "queued"
  | "collecting"
  | "analyzing"
  | "recommending"
  | "completed"
  | "failed";

export type ProductSignalType =
  | "engagement_drop"
  | "conversion_drop"
  | "high_friction"
  | "feature_adoption_gap"
  | "performance_regression"
  | "revenue_opportunity";

export type OptimizationRecommendationType =
  | "ui_change"
  | "workflow_change"
  | "pricing_change"
  | "onboarding_change"
  | "feature_experiment"
  | "performance_fix";

export type ProductSignal = {
  type: ProductSignalType;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  payloadJson?: Record<string, unknown>;
};

export type OptimizationRecommendation = {
  type: OptimizationRecommendationType;
  title: string;
  description: string;
  expectedImpact: "low" | "medium" | "high";
  payloadJson?: Record<string, unknown>;
};
