import { prisma } from "../client";

export const agentToolInvocationsRepository = {
  create(data: {
    id: string;
    agentRunId: string;
    toolName: string;
    title: string;
    status: string;
    inputJson?: unknown;
    outputJson?: unknown;
    errorMessage?: string | null;
  }) {
    return prisma.agentToolInvocation.create({ data });
  },

  listByAgentRun(agentRunId: string) {
    return prisma.agentToolInvocation.findMany({
      where: { agentRunId },
      orderBy: { createdAt: "asc" }
    });
  },

  update(id: string, data: {
    status?: string;
    outputJson?: unknown;
    errorMessage?: string | null;
  }) {
    return prisma.agentToolInvocation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
};
