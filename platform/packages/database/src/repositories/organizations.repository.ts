import { prisma, OrganizationRole } from "@prisma/client";

export const organizationsRepository = {
  async createWithOwner(input: { name: string; slug: string; createdByUserId: string; }) {
    return prisma.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        createdByUserId: input.createdByUserId,
        memberships: { create: { userId: input.createdByUserId, role: OrganizationRole.OWNER } }
      },
      include: { memberships: true }
    });
  },
  listForUser(userId: string) {
    return prisma.organization.findMany({
      where: { memberships: { some: { userId } } },
      orderBy: { createdAt: "desc" }
    });
  }
};
