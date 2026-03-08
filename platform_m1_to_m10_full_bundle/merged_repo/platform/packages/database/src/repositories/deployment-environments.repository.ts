import { prisma } from "../client";

export const deploymentEnvironmentsRepository = {
  create(data: {
    id: string;
    projectId: string;
    environmentType: string;
    name: string;
    status: string;
    url?: string | null;
    runtimeRegionId?: string | null;
  }) {
    return prisma.deploymentEnvironment.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.deploymentEnvironment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  findById(id: string) {
    return prisma.deploymentEnvironment.findUnique({ where: { id } });
  }
};
