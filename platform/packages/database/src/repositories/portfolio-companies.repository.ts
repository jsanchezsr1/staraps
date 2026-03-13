import { prisma } from "../client";

export const portfolioCompaniesRepository = {
  create(data: any) {
    return prisma.portfolioCompany.create({ data });
  },
  findById(id: string) {
    return prisma.portfolioCompany.findUnique({ where: { id } });
  },
  listAll() {
    return prisma.portfolioCompany.findMany({ orderBy: { createdAt: "desc" } });
  },
  update(id: string, data: any) {
    return prisma.portfolioCompany.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }
};
