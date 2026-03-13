import { prisma } from "../client";

export const usageRecordsRepository = {
  create(data: {
    id: string;
    organizationId: string;
    projectId?: string | null;
    metricKey: string;
    quantity: number;
    unit: string;
    periodStart: Date;
    periodEnd: Date;
    metadataJson?: unknown;
  }) {
    return prisma.usageRecord.create({ data });
  },

  listByOrganization(organizationId: string) {
    return prisma.usageRecord.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  },

  aggregateByMetric(input: {
    organizationId: string;
    metricKey: string;
    periodStart: Date;
    periodEnd: Date;
  }) {
    return prisma.usageRecord.aggregate({
      where: {
        organizationId: input.organizationId,
        metricKey: input.metricKey,
        periodStart: { gte: input.periodStart },
        periodEnd: { lte: input.periodEnd }
      },
      _sum: { quantity: true }
    });
  }
};
