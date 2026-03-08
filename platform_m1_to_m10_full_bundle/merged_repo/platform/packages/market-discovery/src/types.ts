export type TrendSourceType =
  | "google_trends"
  | "reddit"
  | "github"
  | "product_hunt"
  | "hacker_news"
  | "x"
  | "app_store"
  | "other";

export type MarketSignalStrength = "low" | "medium" | "high";

export type MarketSignal = {
  sourceType: TrendSourceType;
  keyword: string;
  title: string;
  description: string;
  strength: MarketSignalStrength;
  payloadJson?: Record<string, unknown>;
};

export type OpportunityCluster = {
  name: string;
  description: string;
  keywords: string[];
};

export type OpportunityScore = {
  clusterName: string;
  demandScore: number;
  competitionScore: number;
  opportunityScore: number;
  summary: string;
};
