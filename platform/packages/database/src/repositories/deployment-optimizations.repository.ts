import { prisma } from "../client";

export const deploymentOptimizationsRepository = {
  create(data: {
    id: string;
    deploymentRunId: string;
    category: string;
    title: string;
    description: string;
    payloadJson?: unknown;
  }) {
    return prisma.deploymentOptimization.create({ data });
  },

  listByRun(deploymentRunId: string) {
    return prisma.deploymentOptimization.findMany({
      where: { deploymentRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
