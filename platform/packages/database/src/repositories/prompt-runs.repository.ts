import { prisma } from "../client";

export const promptRunsRepository = {
  create(data: {
    id: string;
    promptVersionId: string;
    inputText?: string | null;
    status: string;
    outputJson?: unknown;
  }) {
    return prisma.promptRun.create({ data });
  },

  update(id: string, data: {
    status?: string;
    outputJson?: unknown;
  }) {
    return prisma.promptRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  listByVersion(promptVersionId: string) {
    return prisma.promptRun.findMany({
      where: { promptVersionId },
      orderBy: { createdAt: "desc" }
    });
  }
};
