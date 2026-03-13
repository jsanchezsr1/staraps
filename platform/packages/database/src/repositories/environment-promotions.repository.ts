import { prisma } from "../client";

export const environmentPromotionsRepository = {
  create(data: {
    id: string;
    projectId: string;
    fromEnvironment: string;
    toEnvironment: string;
    projectVersionId?: string | null;
    status: string;
    requestedByUserId?: string | null;
    approvedByUserId?: string | null;
  }) {
    return prisma.environmentPromotion.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.environmentPromotion.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  approve(id: string, approvedByUserId?: string | null) {
    return prisma.environmentPromotion.update({
      where: { id },
      data: {
        status: "approved",
        approvedByUserId: approvedByUserId || null,
        updatedAt: new Date()
      }
    });
  }
};
