export type VentureAutopilotRunStatus =
  | "queued"
  | "scanning"
  | "selecting"
  | "building"
  | "launching"
  | "reviewing"
  | "completed"
  | "failed";

export type VentureLifecycleDecisionType =
  | "scale"
  | "pivot"
  | "hold"
  | "shutdown";

export type VentureLoopPlan = {
  opportunityName: string;
  marketCategory: string;
  ventureName: string;
  launchMode: string;
  payloadJson?: Record<string, unknown>;
};

export type VentureLifecycleDecision = {
  decisionType: VentureLifecycleDecisionType;
  title: string;
  description: string;
  rationale: string;
  payloadJson?: Record<string, unknown>;
};

export type VentureAutopilotSummary = {
  status: VentureAutopilotRunStatus;
  ventureName: string;
  summary: string;
  nextActions: string[];
};
