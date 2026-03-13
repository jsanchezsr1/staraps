import { prisma } from "../client";

export const experimentsRepository = {
  create(data: {
    id: string;
    projectId: string;
    name: string;
    status: string;
    targetMetric: string;
    hypothesisJson?: unknown;
    summaryJson?: unknown;
    createdByUserId?: string | null;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.experiment.create({ data });
  },

  update(id: string, data: {
    status?: string;
    summaryJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.experiment.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.experiment.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.experiment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
