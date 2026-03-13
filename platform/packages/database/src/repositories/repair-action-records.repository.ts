import { prisma } from "../client";

export const repairActionRecordsRepository = {
  create(data: {
    id: string;
    repairRunId: string;
    actionType: string;
    title: string;
    status: string;
    payloadJson?: unknown;
  }) {
    return prisma.repairActionRecord.create({ data });
  },

  listByRun(repairRunId: string) {
    return prisma.repairActionRecord.findMany({
      where: { repairRunId },
      orderBy: { createdAt: "asc" }
    });
  },

  update(id: string, data: {
    status?: string;
    payloadJson?: unknown;
  }) {
    return prisma.repairActionRecord.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }
};
