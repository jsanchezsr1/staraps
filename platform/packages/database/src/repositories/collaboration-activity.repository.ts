import { prisma } from "../client";

export const collaborationActivityRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    userId?: string | null;
    eventType: string;
    payloadJson?: unknown;
  }) {
    return prisma.collaborationActivityEvent.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.collaborationActivityEvent.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }
};
