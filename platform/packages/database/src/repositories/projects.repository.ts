import { prisma } from "../client";

export const projectsRepository = {
  create(data: { organizationId: string; name: string; slug: string; description?: string; createdByUserId: string; }) {
    return prisma.project.create({ data });
  },
  findById(id: string) {
    return prisma.project.findUnique({ where: { id }, include: { organization: true, latestVersion: true } });
  },
  update(id: string, data: { name?: string; slug?: string; description?: string | null; latestVersionId?: string | null; }) {
    return prisma.project.update({ where: { id }, data });
  },
  remove(id: string) { return prisma.project.delete({ where: { id } }); }
};
