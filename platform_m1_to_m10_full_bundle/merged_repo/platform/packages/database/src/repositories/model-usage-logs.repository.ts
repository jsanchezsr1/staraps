import { prisma } from "../client";

export const modelUsageLogsRepository = {
  create(data: {
    id: string;
    projectId?: string | null;
    providerName: string;
    modelName: string;
    taskType: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    totalCostUsd: number;
  }) {
    return prisma.modelUsageLog.create({ data });
  },

  listAll() {
    return prisma.modelUsageLog.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
