import { prisma } from "../client";

export const optimizationRecommendationRecordsRepository = {
  create(data: {
    id: string;
    productInsightRunId: string;
    recommendationType: string;
    title: string;
    description: string;
    expectedImpact: string;
    payloadJson?: unknown;
  }) {
    return prisma.optimizationRecommendationRecord.create({ data });
  },

  listByRun(productInsightRunId: string) {
    return prisma.optimizationRecommendationRecord.findMany({
      where: { productInsightRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
