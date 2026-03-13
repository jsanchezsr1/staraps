import { prisma } from "../client";

export const marketplacePayoutsRepository = {
  create(data: {
    id: string;
    developerId: string;
    amountCents: number;
    currency: string;
    status: string;
    provider?: string | null;
    providerPayoutId?: string | null;
  }) {
    return prisma.marketplacePayout.create({ data });
  },

  listByDeveloper(developerId: string) {
    return prisma.marketplacePayout.findMany({
      where: { developerId },
      orderBy: { createdAt: "desc" }
    });
  }
};
