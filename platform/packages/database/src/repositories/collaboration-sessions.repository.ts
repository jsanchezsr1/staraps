import { prisma } from "../client";

export const collaborationSessionsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    userId: string;
    status: string;
  }) {
    return prisma.collaborationSession.create({ data });
  },

  findById(id: string) {
    return prisma.collaborationSession.findUnique({ where: { id } });
  },

  listActiveByProject(projectId: string) {
    return prisma.collaborationSession.findMany({
      where: { projectId, endedAt: null },
      orderBy: { lastSeenAt: "desc" }
    });
  },

  updateHeartbeat(id: string) {
    return prisma.collaborationSession.update({
      where: { id },
      data: { lastSeenAt: new Date() }
    });
  },

  end(id: string) {
    return prisma.collaborationSession.update({
      where: { id },
      data: { endedAt: new Date(), status: "ended" }
    });
  }
};
