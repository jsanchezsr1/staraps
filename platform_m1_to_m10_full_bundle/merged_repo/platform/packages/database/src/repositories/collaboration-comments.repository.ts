import { prisma } from "../client";

export const collaborationCommentsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    createdByUserId?: string | null;
    targetType: string;
    targetId: string;
    body: string;
  }) {
    return prisma.collaborationCommentThread.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.collaborationCommentThread.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  resolve(id: string) {
    return prisma.collaborationCommentThread.update({
      where: { id },
      data: { isResolved: true, updatedAt: new Date() }
    });
  }
};
