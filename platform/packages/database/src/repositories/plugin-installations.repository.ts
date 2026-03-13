import { prisma } from "../client";

export const pluginInstallationsRepository = {
  install(data: {
    id: string;
    organizationId: string;
    pluginKey: string;
    enabled?: boolean;
    configJson?: unknown;
  }) {
    return prisma.pluginInstallation.create({
      data: {
        enabled: true,
        ...data
      }
    });
  },

  listForOrganization(organizationId: string) {
    return prisma.pluginInstallation.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  },

  update(id: string, data: {
    enabled?: boolean;
    configJson?: unknown;
  }) {
    return prisma.pluginInstallation.update({
      where: { id },
      data
    });
  }
};
