import { prisma } from "../client";

export const pluginMarketplaceVersionsRepository = {
  create(data: {
    id: string;
    pluginMarketplaceItemId: string;
    version: string;
    changelog?: string | null;
    packageUrl?: string | null;
    manifestJson: unknown;
  }) {
    return prisma.pluginMarketplaceVersion.create({ data });
  },

  listForItem(pluginMarketplaceItemId: string) {
    return prisma.pluginMarketplaceVersion.findMany({
      where: { pluginMarketplaceItemId },
      orderBy: { createdAt: "desc" }
    });
  },

  findLatest(pluginMarketplaceItemId: string) {
    return prisma.pluginMarketplaceVersion.findFirst({
      where: { pluginMarketplaceItemId },
      orderBy: { createdAt: "desc" }
    });
  }
};
