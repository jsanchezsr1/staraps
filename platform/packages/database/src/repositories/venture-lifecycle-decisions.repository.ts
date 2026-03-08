import { prisma } from "../client";

export const ventureLifecycleDecisionsRepository = {
  create(data: any) {
    return prisma.ventureLifecycleDecisionRecord.create({ data });
  },
  listByRun(ventureAutopilotRunId: string) {
    return prisma.ventureLifecycleDecisionRecord.findMany({
      where: { ventureAutopilotRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
