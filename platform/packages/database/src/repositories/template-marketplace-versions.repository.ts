import { prisma } from "../client";

export const templateMarketplaceVersionsRepository = {
  create(data: {
    id: string;
    templateDefinitionId: string;
    version: string;
    changelog?: string | null;
    templateSpecJson: unknown;
  }) {
    return prisma.templateMarketplaceVersion.create({ data });
  },

  listForTemplate(templateDefinitionId: string) {
    return prisma.templateMarketplaceVersion.findMany({
      where: { templateDefinitionId },
      orderBy: { createdAt: "desc" }
    });
  },

  findLatest(templateDefinitionId: string) {
    return prisma.templateMarketplaceVersion.findFirst({
      where: { templateDefinitionId },
      orderBy: { createdAt: "desc" }
    });
  }
};
