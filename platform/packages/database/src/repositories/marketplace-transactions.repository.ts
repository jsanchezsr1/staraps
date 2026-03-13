import { prisma } from "../client";

export const marketplaceTransactionsRepository = {
  create(data: {
    id: string;
    organizationId?: string | null;
    purchaseType: string;
    templateDefinitionId?: string | null;
    pluginMarketplaceItemId?: string | null;
    buyerUserId?: string | null;
    amountCents: number;
    currency: string;
    status: string;
    provider?: string | null;
    providerTransactionId?: string | null;
  }) {
    return prisma.marketplaceTransaction.create({ data });
  },

  listByOrganization(organizationId: string) {
    return prisma.marketplaceTransaction.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  }
};
