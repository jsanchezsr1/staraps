import { prisma } from "../client";

export const growthCampaignsRepository = {
  create(data: {
    id: string;
    projectId?: string | null;
    name: string;
    channelType: string;
    status: string;
    objective: string;
    definitionJson?: unknown;
    createdByUserId?: string | null;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.growthCampaign.create({ data });
  },

  update(id: string, data: {
    status?: string;
    definitionJson?: unknown;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }) {
    return prisma.growthCampaign.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },

  findById(id: string) {
    return prisma.growthCampaign.findUnique({ where: { id } });
  },

  listByProject(projectId: string) {
    return prisma.growthCampaign.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },

  listAll() {
    return prisma.growthCampaign.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
