import { prisma } from "../client";

export const builderSyncRunsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    requestedByUserId?: string | null;
    status: string;
    sourceMode: string;
    diffJson?: unknown;
    conflictsJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.builderSyncRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    diffJson?: unknown;
    conflictsJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.builderSyncRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.builderSyncRun.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.builderSyncRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
