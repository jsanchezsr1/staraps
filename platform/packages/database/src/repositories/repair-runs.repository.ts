import { prisma } from "../client";

export const repairRunsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    requestedByUserId?: string | null;
    status: string;
    diagnosticsJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.repairRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    diagnosticsJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.repairRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.repairRun.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.repairRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
