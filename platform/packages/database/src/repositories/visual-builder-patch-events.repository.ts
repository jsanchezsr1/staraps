import { prisma } from "../client";

export const visualBuilderPatchEventsRepository = {
  create(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    nodeId: string;
    operation: string;
    patchJson?: unknown;
    createdByUserId?: string | null;
  }) {
    return prisma.visualBuilderPatchEvent.create({ data });
  },

  listByProject(projectId: string) {
    return prisma.visualBuilderPatchEvent.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }
};
