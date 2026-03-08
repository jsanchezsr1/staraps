import { prisma } from "../client";

export const pluginMarketplaceRatingsRepository = {
  create(data: {
    id: string;
    pluginMarketplaceItemId: string;
    organizationId?: string | null;
    userId?: string | null;
    rating: number;
    review?: string | null;
  }) {
    return prisma.pluginMarketplaceRating.create({ data });
  },

  listForItem(pluginMarketplaceItemId: string) {
    return prisma.pluginMarketplaceRating.findMany({
      where: { pluginMarketplaceItemId },
      orderBy: { createdAt: "desc" }
    });
  },

  aggregateForItem(pluginMarketplaceItemId: string) {
    return prisma.pluginMarketplaceRating.aggregate({
      where: { pluginMarketplaceItemId },
      _avg: { rating: true },
      _count: { rating: true }
    });
  }
};
