import { prisma } from "../client";

export const launchCampaignRecordsRepository = {
  create(data: any) {
    return prisma.launchCampaignRecord.create({ data });
  },
  listByRun(launchRunId: string) {
    return prisma.launchCampaignRecord.findMany({
      where: { launchRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
