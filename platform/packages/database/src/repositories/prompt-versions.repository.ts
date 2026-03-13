import { prisma } from "../client";

export const promptVersionsRepository = {
  create(data: {
    id: string;
    promptTemplateId: string;
    versionNumber: number;
    body: string;
    changelog?: string | null;
    createdByUserId?: string | null;
  }) {
    return prisma.promptVersion.create({ data });
  },

  listByTemplate(promptTemplateId: string) {
    return prisma.promptVersion.findMany({
      where: { promptTemplateId },
      orderBy: { versionNumber: "desc" }
    });
  },

  findById(id: string) {
    return prisma.promptVersion.findUnique({ where: { id } });
  }
};
