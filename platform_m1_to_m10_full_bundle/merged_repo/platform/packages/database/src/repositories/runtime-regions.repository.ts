import { prisma } from "../client";

export const runtimeRegionsRepository = {
  create(data: {
    id: string;
    key: string;
    cloud: string;
    displayName: string;
    isPrimary?: boolean;
    isEnabled?: boolean;
  }) {
    return prisma.runtimeRegion.create({ data });
  },

  listAll() {
    return prisma.runtimeRegion.findMany({
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }]
    });
  },

  findByKey(key: string) {
    return prisma.runtimeRegion.findUnique({ where: { key } });
  }
};
