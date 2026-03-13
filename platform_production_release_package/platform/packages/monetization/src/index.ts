export type MarketplacePurchaseType = "template" | "plugin";

export type RevenueShareRule = {
  itemType: MarketplacePurchaseType;
  platformPercent: number;
  developerPercent: number;
};

export type DeveloperEarningsSummary = {
  developerId: string;
  grossCents: number;
  developerNetCents: number;
  platformFeeCents: number;
  payoutPendingCents: number;
};
