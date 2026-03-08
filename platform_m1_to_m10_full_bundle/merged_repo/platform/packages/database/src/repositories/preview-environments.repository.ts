import { prisma } from "../client";

export const previewEnvironmentsRepository = {
  create(data: {
    id: string;
    platformJobId: string;
    projectId: string;
    projectVersionId?: string | null;
    runtimeType: string;
    status: string;
    containerId?: string | null;
    host?: string | null;
    port?: number | null;
    previewUrl?: string | null;
    artifactCacheKey?: string | null;
    startedAt?: Date | null;
    expiresAt?: Date | null;
  }) {
    return prisma.previewEnvironment.create({ data });
  },

  findByPlatformJobId(platformJobId: string) {
    return prisma.previewEnvironment.findUnique({ where: { platformJobId } });
  },

  listByProject(projectId: string) {
    return prisma.previewEnvironment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  listActive(now = new Date()) {
    return prisma.previewEnvironment.findMany({
      where: {
        status: { in: ["RUNNING", "STARTING"] },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } }
        ]
      },
      orderBy: { createdAt: "desc" }
    });
  },

  listExpired(now = new Date()) {
    return prisma.previewEnvironment.findMany({
      where: {
        status: { in: ["RUNNING", "STARTING"] },
        expiresAt: { lt: now }
      },
      orderBy: { createdAt: "asc" }
    });
  },

  update(id: string, data: {
    status?: string;
    containerId?: string | null;
    host?: string | null;
    port?: number | null;
    previewUrl?: string | null;
    artifactCacheKey?: string | null;
    startedAt?: Date | null;
    expiresAt?: Date | null;
    stoppedAt?: Date | null;
  }) {
    return prisma.previewEnvironment.update({
      where: { id },
      data
    });
  }
};
