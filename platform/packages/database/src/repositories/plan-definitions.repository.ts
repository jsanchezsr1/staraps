import { prisma } from "../client";

export const planDefinitionsRepository = {
  create(data: {
    id: string;
    key: string;
    name: string;
    monthlyPriceCents: number;
    limitsJson: unknown;
    isActive?: boolean;
  }) {
    return prisma.planDefinition.create({ data });
  },

  findByKey(key: string) {
    return prisma.planDefinition.findUnique({ where: { key } });
  },

  findById(id: string) {
    return prisma.planDefinition.findUnique({ where: { id } });
  },

  listActive() {
    return prisma.planDefinition.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" }
    });
  }
};
