import { prisma } from "../client";

export const deploymentRunsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    deploymentPlanId?: string | null;
    deploymentEnvironmentId?: string | null;
    requestedByUserId?: string | null;
    status: string;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.deploymentRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    deploymentEnvironmentId?: string | null;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.deploymentRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.deploymentRun.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.deploymentRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
