import { prisma } from "../client";

export const edgeRoutingRulesRepository = {
  upsert(data: {
    id: string;
    hostname: string;
    preferredRuntimeRegionId: string;
    fallbackRuntimeRegionId?: string | null;
    healthStatus: string;
    latencyMs?: number | null;
  }) {
    return prisma.edgeRoutingRule.upsert({
      where: { hostname: data.hostname },
      update: {
        preferredRuntimeRegionId: data.preferredRuntimeRegionId,
        fallbackRuntimeRegionId: data.fallbackRuntimeRegionId || null,
        healthStatus: data.healthStatus,
        latencyMs: data.latencyMs || null,
        updatedAt: new Date()
      },
      create: data
    });
  },

  listAll() {
    return prisma.edgeRoutingRule.findMany({
      orderBy: { hostname: "asc" }
    });
  }
};
