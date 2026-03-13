import { prisma } from "../client";

export const regionalDeploymentsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    runtimeRegionId: string;
    environment: string;
    status: string;
    url?: string | null;
  }) {
    return prisma.regionalDeployment.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.regionalDeployment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
