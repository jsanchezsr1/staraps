import { prisma } from "../client";

export const venturePortfolioRepository = {
  create(data: any) {
    return prisma.venturePortfolioEntry.create({ data });
  },
  listAll() {
    return prisma.venturePortfolioEntry.findMany({ orderBy: { createdAt: "desc" } });
  }
};
