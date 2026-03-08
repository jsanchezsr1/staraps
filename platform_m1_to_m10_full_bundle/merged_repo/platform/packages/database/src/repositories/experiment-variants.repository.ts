import { prisma } from "../client";

export const experimentVariantsRepository = {
  create(data: {
    id: string;
    experimentId: string;
    variantKey: string;
    title: string;
    description?: string | null;
    payloadJson?: unknown;
    trafficPercent: number;
  }) {
    return prisma.experimentVariantRecord.create({ data });
  },

  listByExperiment(experimentId: string) {
    return prisma.experimentVariantRecord.findMany({
      where: { experimentId },
      orderBy: { createdAt: "asc" }
    });
  }
};
