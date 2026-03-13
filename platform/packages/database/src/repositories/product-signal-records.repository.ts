import { prisma } from "../client";

export const productSignalRecordsRepository = {
  create(data: {
    id: string;
    productInsightRunId: string;
    signalType: string;
    title: string;
    description: string;
    severity: string;
    payloadJson?: unknown;
  }) {
    return prisma.productSignalRecord.create({ data });
  },

  listByRun(productInsightRunId: string) {
    return prisma.productSignalRecord.findMany({
      where: { productInsightRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
