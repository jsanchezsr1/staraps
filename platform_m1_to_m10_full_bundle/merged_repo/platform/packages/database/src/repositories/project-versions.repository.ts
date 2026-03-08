import { prisma } from "../client";

export const projectVersionsRepository = {
  create(data: { projectId: string; versionNumber: number; appSpecJson: unknown; specSchemaVersion: string; createdByUserId: string; notes?: string; }) {
    return prisma.projectVersion.create({ data });
  },
  listByProject(projectId: string) {
    return prisma.projectVersion.findMany({ where: { projectId }, orderBy: { versionNumber: "desc" } });
  },
  findById(id: string) { return prisma.projectVersion.findUnique({ where: { id } }); }
};
