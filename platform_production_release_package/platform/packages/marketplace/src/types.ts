export type MarketplaceCategory =
  | "crm"
  | "saas"
  | "marketplace"
  | "social"
  | "dashboard"
  | "booking"
  | "dating"
  | "ecommerce";

export type TemplateSearchInput = {
  query?: string;
  category?: MarketplaceCategory | string;
  tags?: string[];
};

export type TemplateAnalyticsSummary = {
  templateDefinitionId: string;
  installs: number;
  avgRating: number;
  ratingCount: number;
};
