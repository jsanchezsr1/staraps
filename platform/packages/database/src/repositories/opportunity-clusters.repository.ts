import { prisma } from "../client";

export const opportunityClustersRepository = {
  create(data: {
    id: string;
    projectId?: string | null;
    name: string;
    description: string;
    keywordsJson?: unknown;
  }) {
    return prisma.opportunityCluster.create({ data });
  },

  listAll() {
    return prisma.opportunityCluster.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
