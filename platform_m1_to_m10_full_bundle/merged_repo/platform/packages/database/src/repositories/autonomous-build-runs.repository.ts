import { prisma } from "../client";

export const autonomousBuildRunsRepository = {
  create(data: {
    id: string;
    organizationId?: string | null;
    projectId?: string | null;
    requestedByUserId?: string | null;
    prompt: string;
    status: string;
    planJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.autonomousBuildRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    planJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.autonomousBuildRun.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  },

  listByOrganization(organizationId: string) {
    return prisma.autonomousBuildRun.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  },

  findById(id: string) {
    return prisma.autonomousBuildRun.findUnique({ where: { id } });
  }
};
