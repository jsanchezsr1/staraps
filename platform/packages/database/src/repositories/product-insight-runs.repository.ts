import { prisma } from "../client";

export const productInsightRunsRepository = {
  create(data: {
    id: string;
    projectId: string;
    status: string;
    inputMetricsJson?: unknown;
    summaryJson?: unknown;
    createdByUserId?: string | null;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.productInsightRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    inputMetricsJson?: unknown;
    summaryJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.productInsightRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.productInsightRun.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.productInsightRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
