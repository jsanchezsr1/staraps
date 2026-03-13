import { prisma } from "../client";

export const promptEvaluationsRepository = {
  create(data: {
    id: string;
    promptVersionId: string;
    status: string;
    summary?: string | null;
    scoreJson?: unknown;
  }) {
    return prisma.promptEvaluation.create({ data });
  },

  listByVersion(promptVersionId: string) {
    return prisma.promptEvaluation.findMany({
      where: { promptVersionId },
      orderBy: { createdAt: "desc" }
    });
  }
};
