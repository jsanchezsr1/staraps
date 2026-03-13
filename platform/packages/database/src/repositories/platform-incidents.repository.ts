import { prisma } from "../client";

export const platformIncidentsRepository = {
  create(data: {
    id: string;
    runtimeRegionId?: string | null;
    serviceName: string;
    severity: string;
    status: string;
    summary: string;
    details?: string | null;
  }) {
    return prisma.platformIncident.create({ data });
  },

  listAll() {
    return prisma.platformIncident.findMany({
      orderBy: { createdAt: "desc" }
    });
  },

  resolve(id: string) {
    return prisma.platformIncident.update({
      where: { id },
      data: {
        status: "resolved",
        resolvedAt: new Date()
      }
    });
  }
};
