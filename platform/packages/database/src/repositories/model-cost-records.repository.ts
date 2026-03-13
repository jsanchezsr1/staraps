import { prisma } from "../client";

export const modelCostRecordsRepository = {
  create(data: {
    id: string;
    modelUsageLogId: string;
    promptCostUsd: number;
    completionCostUsd: number;
    totalCostUsd: number;
  }) {
    return prisma.modelCostRecord.create({ data });
  },

  listAll() {
    return prisma.modelCostRecord.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
