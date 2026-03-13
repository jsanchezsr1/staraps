import { prisma } from "../client";

export const collaborationPresenceRepository = {
  upsert(data: {
    id: string;
    sessionId: string;
    status: string;
    cursorJson?: unknown;
    selectedNodeId?: string | null;
  }) {
    return prisma.collaborationPresence.upsert({
      where: { sessionId: data.sessionId },
      update: {
        status: data.status,
        cursorJson: data.cursorJson || null,
        selectedNodeId: data.selectedNodeId || null,
        updatedAt: new Date()
      },
      create: data
    });
  },

  listByProject(projectId: string) {
    return prisma.collaborationPresence.findMany({
      where: {
        session: { projectId, endedAt: null }
      },
      include: { session: true },
      orderBy: { updatedAt: "desc" }
    });
  }
};
