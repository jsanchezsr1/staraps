export type GrowthCampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export type GrowthChannelType =
  | "seo"
  | "landing_page"
  | "email"
  | "paid_ads"
  | "referral"
  | "viral_loop"
  | "social";

export type TrafficSourceType =
  | "organic_search"
  | "direct"
  | "referral"
  | "social"
  | "paid"
  | "email";

export type GrowthCampaignDefinition = {
  name: string;
  channelType: GrowthChannelType;
  objective: string;
  targetAudience?: string;
  assetsJson?: Record<string, unknown>;
};

export type GrowthOutcomeSummary = {
  status: GrowthCampaignStatus;
  sessions: number;
  conversions: number;
  revenue: number;
  summary: string;
};
