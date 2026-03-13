import { prisma } from "../client";

export const agentWorkflowStepsRepository = {
  create(data: {
    id: string;
    agentWorkflowId: string;
    stepKey: string;
    stepType: string;
    title: string;
    description?: string | null;
    configJson?: unknown;
  }) {
    return prisma.agentWorkflowStep.create({ data });
  },

  listByWorkflow(agentWorkflowId: string) {
    return prisma.agentWorkflowStep.findMany({
      where: { agentWorkflowId },
      orderBy: { createdAt: "asc" }
    });
  }
};
