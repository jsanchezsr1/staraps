import { prisma } from "../client";

export const agentRunsRepository = {
  create(data) {
    return prisma.agentRun.create({ data });
  },
  listByProject(projectId) {
    return prisma.agentRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
  },
  findById(id) {
    return prisma.agentRun.findUnique({ where: { id } });
  }
};
