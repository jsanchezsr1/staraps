import { prisma } from "../client";

export const trafficSourcesRepository = {
  upsert(data: {
    id: string;
    sourceType: string;
    displayName: string;
  }) {
    return prisma.trafficSource.upsert({
      where: { sourceType: data.sourceType },
      update: { displayName: data.displayName },
      create: data
    });
  },

  listAll() {
    return prisma.trafficSource.findMany({
      orderBy: { displayName: "asc" }
    });
  }
};
