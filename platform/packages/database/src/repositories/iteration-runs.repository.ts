import { prisma } from "../client";

export const iterationRunsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    requestedByUserId?: string | null;
    status: string;
    contextJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.iterationRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    contextJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.iterationRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.iterationRun.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.iterationRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
