import { prisma } from "../client";

export const autonomousBuildStepsRepository = {
  create(data: {
    id: string;
    autonomousBuildRunId: string;
    stepType: string;
    title: string;
    status: string;
    detailsJson?: unknown;
  }) {
    return prisma.autonomousBuildStep.create({ data });
  },

  listByRun(autonomousBuildRunId: string) {
    return prisma.autonomousBuildStep.findMany({
      where: { autonomousBuildRunId },
      orderBy: { createdAt: "asc" }
    });
  },

  update(id: string, data: {
    status?: string;
    detailsJson?: unknown;
  }) {
    return prisma.autonomousBuildStep.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
};
