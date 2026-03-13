export type PortfolioCompanyStatus =
  | "active"
  | "paused"
  | "pivoting"
  | "growing"
  | "archived";

export type PortfolioKpiType =
  | "mrr"
  | "arr"
  | "active_users"
  | "retention"
  | "conversion_rate"
  | "cac"
  | "ltv";

export type PortfolioInterventionType =
  | "pricing_adjustment"
  | "growth_campaign"
  | "product_focus"
  | "cost_reduction"
  | "hiring_plan"
  | "market_repositioning";

export type PortfolioKpiSnapshot = {
  metric: PortfolioKpiType;
  value: number;
  period: string;
};

export type PortfolioIntervention = {
  type: PortfolioInterventionType;
  title: string;
  description: string;
  expectedImpact: "low" | "medium" | "high";
  payloadJson?: Record<string, unknown>;
};
