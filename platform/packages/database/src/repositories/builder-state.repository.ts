import { prisma } from "../client";

export const builderStateRepository = {
  upsert(data: {
    id: string;
    projectId: string;
    projectVersionId?: string | null;
    layoutJson: unknown;
    selectedNodeId?: string | null;
  }) {
    return prisma.builderState.upsert({
      where: { projectId: data.projectId },
      update: {
        projectVersionId: data.projectVersionId ?? null,
        layoutJson: data.layoutJson,
        selectedNodeId: data.selectedNodeId ?? null
      },
      create: data
    });
  },

  findByProjectId(projectId: string) {
    return prisma.builderState.findUnique({
      where: { projectId }
    });
  }
};
