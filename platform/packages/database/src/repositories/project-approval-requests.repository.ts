import { prisma } from "../client";

export const projectApprovalRequestsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    status: string;
    requestedByUserId?: string | null;
    approvedByUserId?: string | null;
    notes?: string | null;
  }) {
    return prisma.projectApprovalRequest.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.projectApprovalRequest.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  approve(id: string, approvedByUserId?: string | null) {
    return prisma.projectApprovalRequest.update({
      where: { id },
      data: {
        status: "approved",
        approvedByUserId: approvedByUserId || null,
        updatedAt: new Date()
      }
    });
  }
};
