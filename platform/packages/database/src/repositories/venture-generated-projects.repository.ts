import { prisma } from "../client";

export const ventureGeneratedProjectsRepository = {
  create(data: any) {
    return prisma.ventureGeneratedProject.create({ data });
  },
  listByBuildRun(ventureBuildRunId: string) {
    return prisma.ventureGeneratedProject.findMany({
      where: { ventureBuildRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
