import { prisma } from "../client";

export const builderRegenerationTriggersRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    triggerType: string;
    source: string;
    status: string;
    payloadJson?: unknown;
    createdByUserId?: string | null;
  }) {
    return prisma.builderRegenerationTrigger.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.builderRegenerationTrigger.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
