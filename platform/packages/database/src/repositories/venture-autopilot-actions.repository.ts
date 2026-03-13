import { prisma } from "../client";

export const ventureAutopilotActionsRepository = {
  create(data: any) {
    return prisma.ventureAutopilotAction.create({ data });
  },
  listByRun(ventureAutopilotRunId: string) {
    return prisma.ventureAutopilotAction.findMany({
      where: { ventureAutopilotRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
