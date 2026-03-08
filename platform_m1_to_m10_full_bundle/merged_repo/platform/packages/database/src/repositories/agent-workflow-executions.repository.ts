import { prisma } from "../client";

export const agentWorkflowExecutionsRepository = {
  create(data: {
    id: string;
    agentWorkflowId: string;
    projectId: string;
    status: string;
    inputJson?: unknown;
    resultJson?: unknown;
    createdByUserId?: string | null;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.agentWorkflowExecution.create({ data });
  },

  update(id: string, data: {
    status?: string;
    inputJson?: unknown;
    resultJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.agentWorkflowExecution.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  },

  findById(id: string) {
    return prisma.agentWorkflowExecution.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.agentWorkflowExecution.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  }
};
