import { prisma } from "../client";

export const scimProvisioningRepository = {
  upsertConfig(data: {
    id: string;
    organizationId: string;
    tokenHash?: string | null;
    baseUrl?: string | null;
    enabled?: boolean;
  }) {
    return prisma.scimProvisioningConfig.upsert({
      where: { organizationId: data.organizationId },
      update: {
        tokenHash: data.tokenHash || null,
        baseUrl: data.baseUrl || null,
        enabled: data.enabled ?? true
      },
      create: {
        ...data,
        enabled: data.enabled ?? true
      }
    });
  },

  createEvent(data: {
    id: string;
    organizationId: string;
    eventType: string;
    payloadJson: unknown;
  }) {
    return prisma.scimProvisioningEvent.create({ data });
  },

  listEvents(organizationId: string) {
    return prisma.scimProvisioningEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  }
};
