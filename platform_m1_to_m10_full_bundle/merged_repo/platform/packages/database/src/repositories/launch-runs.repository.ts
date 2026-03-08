import { prisma } from "../client";

export const launchRunsRepository = {
  create(data: any) {
    return prisma.launchRun.create({ data });
  },
  update(id: string, data: any) {
    return prisma.launchRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },
  findById(id: string) {
    return prisma.launchRun.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.launchRun.findMany({ orderBy: { createdAt: "desc" } });
  }
};
