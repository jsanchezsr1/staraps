import { prisma } from "../client";

export const templateRatingsRepository = {
  create(data: {
    id: string;
    templateDefinitionId: string;
    organizationId?: string | null;
    userId?: string | null;
    rating: number;
    review?: string | null;
  }) {
    return prisma.templateRating.create({ data });
  },

  listForTemplate(templateDefinitionId: string) {
    return prisma.templateRating.findMany({
      where: { templateDefinitionId },
      orderBy: { createdAt: "desc" }
    });
  },

  aggregateForTemplate(templateDefinitionId: string) {
    return prisma.templateRating.aggregate({
      where: { templateDefinitionId },
      _avg: { rating: true },
      _count: { rating: true }
    });
  }
};
