import { prisma } from "../client";

export const portfolioKpiSnapshotsRepository = {
  create(data: any) {
    return prisma.portfolioKpiSnapshot.create({ data });
  },
  listByCompany(portfolioCompanyId: string) {
    return prisma.portfolioKpiSnapshot.findMany({
      where: { portfolioCompanyId },
      orderBy: { createdAt: "asc" }
    });
  }
};
