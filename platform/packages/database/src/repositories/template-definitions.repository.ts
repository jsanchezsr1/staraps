import { prisma } from "../client";

export const templateDefinitionsRepository = {
  create(data: {
    id: string;
    key: string;
    name: string;
    slug: string;
    description?: string | null;
    category: string;
    version: string;
    thumbnailUrl?: string | null;
    templateSpecJson: unknown;
    tagsJson?: unknown;
    isPublished?: boolean;
  }) {
    return prisma.templateDefinition.create({ data });
  },

  findById(id: string) {
    return prisma.templateDefinition.findUnique({ where: { id } });
  },

  findByKey(key: string) {
    return prisma.templateDefinition.findUnique({ where: { key } });
  },

  listPublished() {
    return prisma.templateDefinition.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" }
    });
  },

  listByCategory(category: string) {
    return prisma.templateDefinition.findMany({
      where: { category, isPublished: true },
      orderBy: { createdAt: "desc" }
    });
  }
};
