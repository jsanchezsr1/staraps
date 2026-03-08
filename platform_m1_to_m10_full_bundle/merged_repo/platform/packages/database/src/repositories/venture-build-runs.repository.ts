import { prisma } from "../client";

export const ventureBuildRunsRepository = {
  create(data: any) {
    return prisma.ventureBuildRun.create({ data });
  },
  update(id: string, data: any) {
    return prisma.ventureBuildRun.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  },
  findById(id: string) {
    return prisma.ventureBuildRun.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.ventureBuildRun.findMany({ orderBy: { createdAt: "desc" } });
  }
};
