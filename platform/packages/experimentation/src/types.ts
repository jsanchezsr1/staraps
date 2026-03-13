export type ExperimentStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export type ExperimentMetricType =
  | "conversion"
  | "engagement"
  | "retention"
  | "revenue"
  | "latency"
  | "adoption";

export type ExperimentHypothesis = {
  title: string;
  description: string;
  targetMetric: ExperimentMetricType;
  expectedLiftPercent?: number;
};

export type ExperimentVariant = {
  key: string;
  title: string;
  description?: string;
  payloadJson?: Record<string, unknown>;
  trafficPercent: number;
};

export type ExperimentResultSummary = {
  status: ExperimentStatus;
  winningVariantKey?: string;
  summary: string;
  confidence?: number;
};
