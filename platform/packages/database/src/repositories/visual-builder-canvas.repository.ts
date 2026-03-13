import { prisma } from "../client";

export const visualBuilderCanvasRepository = {
  upsert(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    stateJson: unknown;
  }) {
    return prisma.visualBuilderCanvas.upsert({
      where: { projectId: data.projectId },
      update: {
        projectVersionId: data.projectVersionId || null,
        stateJson: data.stateJson,
        updatedAt: new Date()
      },
      create: data
    });
  },

  findByProject(projectId: string) {
    return prisma.visualBuilderCanvas.findUnique({ where: { projectId } });
  }
};
