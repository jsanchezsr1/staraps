import { prisma } from "../client";

export const ventureIdeasRepository = {
  create(data: any) {
    return prisma.ventureIdea.create({ data });
  },
  findById(id: string) {
    return prisma.ventureIdea.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.ventureIdea.findMany({ orderBy: { createdAt: "desc" } });
  }
};
