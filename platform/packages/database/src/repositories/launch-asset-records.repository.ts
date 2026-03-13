import { prisma } from "../client";

export const launchAssetRecordsRepository = {
  create(data: any) {
    return prisma.launchAssetRecord.create({ data });
  },
  listByRun(launchRunId: string) {
    return prisma.launchAssetRecord.findMany({
      where: { launchRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
