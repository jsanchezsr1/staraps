import { prisma } from "../client";

export const templateInstallationsRepository = {
  create(data: {
    id: string;
    organizationId: string;
    templateDefinitionId: string;
    installedByUserId?: string | null;
    projectId?: string | null;
    status: string;
  }) {
    return prisma.templateInstallation.create({ data });
  },

  listForOrganization(organizationId: string) {
    return prisma.templateInstallation.findMany({
      where: { organizationId },
      include: { templateDefinition: true, project: true },
      orderBy: { createdAt: "desc" }
    });
  },

  update(id: string, data: {
    status?: string;
    projectId?: string | null;
  }) {
    return prisma.templateInstallation.update({
      where: { id },
      data
    });
  }
};
