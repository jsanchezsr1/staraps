import { prisma } from "../client";

export const trendSourcesRepository = {
  upsert(data: {
    id: string;
    sourceType: string;
    displayName: string;
    isEnabled?: boolean;
  }) {
    return prisma.trendSource.upsert({
      where: { sourceType: data.sourceType },
      update: {
        displayName: data.displayName,
        isEnabled: data.isEnabled ?? true,
        updatedAt: new Date()
      },
      create: {
        ...data,
        isEnabled: data.isEnabled ?? true
      }
    });
  },

  listAll() {
    return prisma.trendSource.findMany({
      orderBy: { displayName: "asc" }
    });
  }
};
