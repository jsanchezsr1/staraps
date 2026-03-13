import { prisma } from "../client";

export const deploymentPlansRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    environmentType: string;
    planJson: unknown;
    createdByUserId?: string | null;
  }) {
    return prisma.deploymentPlan.create({ data });
  },

  findById(id: string) {
    return prisma.deploymentPlan.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.deploymentPlan.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
