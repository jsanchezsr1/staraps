import { prisma } from "../client";

export const platformServiceHealthRepository = {
  create(data: {
    id: string;
    serviceName: string;
    runtimeRegionId?: string | null;
    status: string;
    detailsJson?: unknown;
  }) {
    return prisma.platformServiceHealth.create({ data });
  },

  listLatest() {
    return prisma.platformServiceHealth.findMany({
      orderBy: { checkedAt: "desc" },
      take: 100
    });
  }
};
