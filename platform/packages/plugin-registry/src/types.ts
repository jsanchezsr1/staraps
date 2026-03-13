export type PluginMarketplaceCategory =
  | "integration"
  | "deployment"
  | "ui"
  | "generator"
  | "analytics"
  | "auth"
  | "storage"
  | "billing";

export type PluginPermission =
  | "read:projects"
  | "write:projects"
  | "read:versions"
  | "write:versions"
  | "read:deployments"
  | "write:deployments"
  | "read:billing"
  | "write:billing"
  | "read:marketplace"
  | "write:marketplace";

export type PluginSearchInput = {
  query?: string;
  category?: PluginMarketplaceCategory | string;
  tags?: string[];
};

export type PluginAnalyticsSummary = {
  pluginMarketplaceItemId: string;
  installs: number;
  avgRating: number;
  ratingCount: number;
};
