import { prisma } from "../client";

export const marketSignalsRepository = {
  create(data: {
    id: string;
    projectId?: string | null;
    trendSourceId?: string | null;
    keyword: string;
    title: string;
    description: string;
    strength: string;
    payloadJson?: unknown;
  }) {
    return prisma.marketSignal.create({ data });
  },

  listAll() {
    return prisma.marketSignal.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
