import { randomUUID } from "crypto";
import {
  developerBalanceRepository,
  marketplacePayoutsRepository,
  marketplaceRevenueShareRepository,
  marketplaceTransactionsRepository
} from "@platform/database";

function calculateRevenueShare(amountCents: number) {
  const developerNetCents = Math.round(amountCents * 0.7);
  const platformFeeCents = amountCents - developerNetCents;
  return { developerNetCents, platformFeeCents };
}

export async function purchaseTemplate(input: {
  organizationId?: string;
  buyerUserId?: string;
  templateDefinitionId: string;
  amountCents: number;
  currency: string;
  provider?: string;
}) {
  return marketplaceTransactionsRepository.create({
    id: randomUUID(),
    organizationId: input.organizationId || null,
    purchaseType: "template",
    templateDefinitionId: input.templateDefinitionId,
    buyerUserId: input.buyerUserId || null,
    amountCents: input.amountCents,
    currency: input.currency,
    status: "completed",
    provider: input.provider || null,
    providerTransactionId: null
  });
}

export async function purchasePlugin(input: {
  organizationId?: string;
  buyerUserId?: string;
  pluginMarketplaceItemId: string;
  developerId?: string;
  amountCents: number;
  currency: string;
  provider?: string;
}) {
  const tx = await marketplaceTransactionsRepository.create({
    id: randomUUID(),
    organizationId: input.organizationId || null,
    purchaseType: "plugin",
    pluginMarketplaceItemId: input.pluginMarketplaceItemId,
    buyerUserId: input.buyerUserId || null,
    amountCents: input.amountCents,
    currency: input.currency,
    status: "completed",
    provider: input.provider || null,
    providerTransactionId: null
  });

  const share = calculateRevenueShare(input.amountCents);

  await marketplaceRevenueShareRepository.create({
    id: randomUUID(),
    transactionId: tx.id,
    developerId: input.developerId || null,
    grossCents: input.amountCents,
    developerNetCents: share.developerNetCents,
    platformFeeCents: share.platformFeeCents
  });

  if (input.developerId) {
    const current = await developerBalanceRepository.findByDeveloper(input.developerId);
    await developerBalanceRepository.upsert({
      id: randomUUID(),
      developerId: input.developerId,
      pendingCents: (current?.pendingCents || 0) + share.developerNetCents,
      paidCents: current?.paidCents || 0
    });
  }

  return tx;
}

export async function requestDeveloperPayout(input: {
  developerId: string;
  amountCents: number;
  currency: string;
  provider?: string;
}) {
  const current = await developerBalanceRepository.findByDeveloper(input.developerId);

  const payout = await marketplacePayoutsRepository.create({
    id: randomUUID(),
    developerId: input.developerId,
    amountCents: input.amountCents,
    currency: input.currency,
    status: "pending",
    provider: input.provider || null,
    providerPayoutId: null
  });

  await developerBalanceRepository.upsert({
    id: randomUUID(),
    developerId: input.developerId,
    pendingCents: Math.max((current?.pendingCents || 0) - input.amountCents, 0),
    paidCents: (current?.paidCents || 0) + input.amountCents
  });

  return payout;
}
