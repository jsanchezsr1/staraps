import { prisma } from "../client";

export const developerBalanceRepository = {
  upsert(data: {
    id: string;
    developerId: string;
    pendingCents: number;
    paidCents: number;
  }) {
    return prisma.developerBalance.upsert({
      where: { developerId: data.developerId },
      update: {
        pendingCents: data.pendingCents,
        paidCents: data.paidCents,
        updatedAt: new Date()
      },
      create: data
    });
  },

  findByDeveloper(developerId: string) {
    return prisma.developerBalance.findUnique({ where: { developerId } });
  }
};
