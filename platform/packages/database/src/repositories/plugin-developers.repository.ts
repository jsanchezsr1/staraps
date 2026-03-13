import { prisma } from "../client";

export const pluginDevelopersRepository = {
  create(data: {
    id: string;
    userId?: string | null;
    organizationId?: string | null;
    displayName: string;
    slug: string;
    bio?: string | null;
    websiteUrl?: string | null;
  }) {
    return prisma.pluginDeveloper.create({ data });
  },

  findById(id: string) {
    return prisma.pluginDeveloper.findUnique({ where: { id } });
  },

  findBySlug(slug: string) {
    return prisma.pluginDeveloper.findUnique({ where: { slug } });
  }
};
