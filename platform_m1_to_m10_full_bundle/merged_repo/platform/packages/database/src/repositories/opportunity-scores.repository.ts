import { prisma } from "../client";

export const opportunityScoresRepository = {
  create(data: {
    id: string;
    opportunityClusterId: string;
    demandScore: number;
    competitionScore: number;
    opportunityScore: number;
    summary: string;
  }) {
    return prisma.opportunityScore.create({ data });
  },

  listAll() {
    return prisma.opportunityScore.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
