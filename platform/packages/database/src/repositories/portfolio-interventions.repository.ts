import { prisma } from "../client";

export const portfolioInterventionsRepository = {
  create(data: any) {
    return prisma.portfolioInterventionRecord.create({ data });
  },
  listByCompany(portfolioCompanyId: string) {
    return prisma.portfolioInterventionRecord.findMany({
      where: { portfolioCompanyId },
      orderBy: { createdAt: "asc" }
    });
  }
};
