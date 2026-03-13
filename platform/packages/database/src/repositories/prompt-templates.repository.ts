import { prisma } from "../client";

export const promptTemplatesRepository = {
  create(data: {
    id: string;
    name: string;
    slug: string;
    category: string;
    description?: string | null;
    createdByUserId?: string | null;
  }) {
    return prisma.promptTemplate.create({ data });
  },

  findById(id: string) {
    return prisma.promptTemplate.findUnique({ where: { id } });
  },

  listAll() {
    return prisma.promptTemplate.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
