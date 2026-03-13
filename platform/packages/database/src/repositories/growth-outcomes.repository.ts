import { prisma } from "../client";

export const growthOutcomesRepository = {
  create(data: {
    id: string;
    growthCampaignId: string;
    trafficSourceId?: string | null;
    sessions: number;
    conversions: number;
    revenue: number;
    summary: string;
  }) {
    return prisma.growthOutcome.create({ data });
  },

  listByCampaign(growthCampaignId: string) {
    return prisma.growthOutcome.findMany({
      where: { growthCampaignId },
      orderBy: { createdAt: "asc" }
    });
  }
};
