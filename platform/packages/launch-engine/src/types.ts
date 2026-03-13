export type LaunchRunStatus =
  | "queued"
  | "planning"
  | "asset_generating"
  | "campaign_preparing"
  | "readiness_check"
  | "completed"
  | "failed";

export type LaunchAssetType =
  | "landing_page"
  | "seo_page"
  | "pricing_page"
  | "waitlist_page"
  | "ad_creative"
  | "email_sequence";

export type LaunchPlan = {
  productName: string;
  audience: string;
  positioning: string;
  primaryOffer: string;
  launchChannels: string[];
  payloadJson?: Record<string, unknown>;
};

export type LaunchAsset = {
  assetType: LaunchAssetType;
  title: string;
  slug: string;
  contentSummary: string;
  payloadJson?: Record<string, unknown>;
};

export type LaunchReadiness = {
  status: "draft" | "ready_for_launch" | "launched";
  summary: string;
  checklist: string[];
};
