import { prisma } from "../client";

export const previewRoutingRepository = {
  upsert(data: {
    id: string;
    previewEnvironmentId: string;
    hostname: string;
    pathPrefix?: string | null;
    targetHost: string;
    targetPort: number;
    provider: string;
  }) {
    return prisma.previewRouting.upsert({
      where: { previewEnvironmentId: data.previewEnvironmentId },
      update: {
        hostname: data.hostname,
        pathPrefix: data.pathPrefix ?? null,
        targetHost: data.targetHost,
        targetPort: data.targetPort,
        provider: data.provider
      },
      create: data
    });
  },

  findByHostname(hostname: string) {
    return prisma.previewRouting.findFirst({ where: { hostname } });
  },

  listAll() {
    return prisma.previewRouting.findMany({ orderBy: { createdAt: "desc" } });
  }
};
