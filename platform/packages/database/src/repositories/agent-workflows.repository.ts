import { prisma } from "../client";

export const agentWorkflowsRepository = {
  create(data: {
    id: string;
    projectId: string;
    name: string;
    slug: string;
    description?: string | null;
    definitionJson: unknown;
    createdByUserId?: string | null;
  }) {
    return prisma.agentWorkflow.create({ data });
  },

  findById(id: string) {
    return prisma.agentWorkflow.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.agentWorkflow.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
