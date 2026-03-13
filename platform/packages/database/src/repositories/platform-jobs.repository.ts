import { prisma } from "../client";

export const platformJobsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    requestedByUserId?: string | null;
    type: "PREVIEW" | "DEPLOYMENT";
    status: string;
    target?: string | null;
    log?: string | null;
  }) {
    return prisma.platformJob.create({ data });
  },

  findById(id: string) {
    return prisma.platformJob.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.platformJob.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  update(id: string, data: {
    status?: string;
    log?: string | null;
    previewUrl?: string | null;
    deploymentUrl?: string | null;
    startedAt?: Date | null;
    finishedAt?: Date | null;
    target?: string | null;
  }) {
    return prisma.platformJob.update({
      where: { id },
      data
    });
  }
};
