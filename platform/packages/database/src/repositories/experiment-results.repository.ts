import { prisma } from "../client";

export const experimentResultsRepository = {
  create(data: {
    id: string;
    experimentId: string;
    variantKey?: string | null;
    metricName: string;
    metricValue: number;
  }) {
    return prisma.experimentResultRecord.create({ data });
  },

  listByExperiment(experimentId: string) {
    return prisma.experimentResultRecord.findMany({
      where: { experimentId },
      orderBy: { createdAt: "asc" }
    });
  }
};
