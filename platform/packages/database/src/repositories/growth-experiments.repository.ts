import { prisma } from "../client";

export const growthExperimentsRepository = {
  create(data: {
    id: string;
    growthCampaignId: string;
    name: string;
    hypothesis?: string | null;
    variantJson?: unknown;
  }) {
    return prisma.growthExperiment.create({ data });
  },

  listByCampaign(growthCampaignId: string) {
    return prisma.growthExperiment.findMany({
      where: { growthCampaignId },
      orderBy: { createdAt: "asc" }
    });
  }
};
