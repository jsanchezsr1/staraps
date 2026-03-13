import { prisma } from "../client";

export const ventureAutopilotRunsRepository = {
  create(data: any) {
    return prisma.ventureAutopilotRun.create({ data });
  },
  update(id: string, data: any) {
    return prisma.ventureAutopilotRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },
  findById(id: string) {
    return prisma.ventureAutopilotRun.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.ventureAutopilotRun.findMany({ orderBy: { createdAt: "desc" } });
  }
};
