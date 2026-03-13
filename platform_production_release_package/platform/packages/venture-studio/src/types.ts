export type VentureCreationRunStatus =
  | "queued"
  | "researching"
  | "synthesizing"
  | "scoring"
  | "completed"
  | "failed";

export type VentureStage =
  | "idea"
  | "validation"
  | "build"
  | "launch"
  | "growth"
  | "archived";

export type VentureThesis = {
  title: string;
  problem: string;
  targetCustomer: string;
  wedge: string;
  marketCategory: string;
  payloadJson?: Record<string, unknown>;
};

export type StartupConcept = {
  name: string;
  summary: string;
  pricingModel: string;
  distributionModel: string;
  moat: string;
  payloadJson?: Record<string, unknown>;
};

export type VentureScorecard = {
  marketScore: number;
  speedToBuildScore: number;
  monetizationScore: number;
  defensibilityScore: number;
  overallScore: number;
  summary: string;
};
