import { prisma } from "../client";

export const organizationSubscriptionsRepository = {
  upsert(data: {
    id: string;
    organizationId: string;
    planDefinitionId: string;
    status: string;
    billingProvider?: string | null;
    providerCustomerId?: string | null;
    providerSubscriptionId?: string | null;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
    cancelAtPeriodEnd?: boolean;
  }) {
    return prisma.organizationSubscription.upsert({
      where: { organizationId: data.organizationId },
      update: {
        planDefinitionId: data.planDefinitionId,
        status: data.status,
        billingProvider: data.billingProvider ?? null,
        providerCustomerId: data.providerCustomerId ?? null,
        providerSubscriptionId: data.providerSubscriptionId ?? null,
        currentPeriodStart: data.currentPeriodStart ?? null,
        currentPeriodEnd: data.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false
      },
      create: data
    });
  },

  findByOrganizationId(organizationId: string) {
    return prisma.organizationSubscription.findUnique({
      where: { organizationId },
      include: { planDefinition: true }
    });
  }
};
