import { prisma } from "../client";

export const ventureCreationRunsRepository = {
  create(data: any) {
    return prisma.ventureCreationRun.create({ data });
  },
  update(id: string, data: any) {
    return prisma.ventureCreationRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },
  findById(id: string) {
    return prisma.ventureCreationRun.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.ventureCreationRun.findMany({ orderBy: { createdAt: "desc" } });
  }
};
