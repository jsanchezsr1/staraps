import { prisma } from "../client";

export const pluginMarketplaceItemsRepository = {
  create(data: {
    id: string;
    developerId: string;
    key: string;
    name: string;
    slug: string;
    category: string;
    description?: string | null;
    permissionsJson: unknown;
    manifestJson: unknown;
    thumbnailUrl?: string | null;
    isPublished?: boolean;
  }) {
    return prisma.pluginMarketplaceItem.create({ data });
  },

  findById(id: string) {
    return prisma.pluginMarketplaceItem.findUnique({ where: { id } });
  },

  findByKey(key: string) {
    return prisma.pluginMarketplaceItem.findUnique({ where: { key } });
  },

  listPublished() {
    return prisma.pluginMarketplaceItem.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" }
    });
  },

  listByCategory(category: string) {
    return prisma.pluginMarketplaceItem.findMany({
      where: { category, isPublished: true },
      orderBy: { createdAt: "desc" }
    });
  }
};
