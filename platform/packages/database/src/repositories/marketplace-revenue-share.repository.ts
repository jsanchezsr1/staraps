import { prisma } from "../client";

export const marketplaceRevenueShareRepository = {
  create(data: {
    id: string;
    transactionId: string;
    developerId?: string | null;
    grossCents: number;
    developerNetCents: number;
    platformFeeCents: number;
  }) {
    return prisma.marketplaceRevenueShare.create({ data });
  },

  listByDeveloper(developerId: string) {
    return prisma.marketplaceRevenueShare.findMany({
      where: { developerId },
      orderBy: { createdAt: "desc" }
    });
  }
};
