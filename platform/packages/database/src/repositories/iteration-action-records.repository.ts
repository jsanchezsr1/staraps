import { prisma } from "../client";

export const iterationActionRecordsRepository = {
  create(data: {
    id: string;
    iterationRunId: string;
    actionType: string;
    title: string;
    status: string;
    payloadJson?: unknown;
  }) {
    return prisma.iterationActionRecord.create({ data });
  },

  listByRun(iterationRunId: string) {
    return prisma.iterationActionRecord.findMany({
      where: { iterationRunId },
      orderBy: { createdAt: "asc" }
    });
  },

  update(id: string, data: {
    status?: string;
    payloadJson?: unknown;
  }) {
    return prisma.iterationActionRecord.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }
};
