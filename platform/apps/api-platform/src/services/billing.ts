import { randomUUID } from "crypto";
import {
  organizationSubscriptionsRepository,
  planDefinitionsRepository,
  usageRecordsRepository
} from "@platform/database";
import { seedPlanDefinitions } from "@platform/billing";

export async function ensurePlansSeeded() {
  await seedPlanDefinitions();
}

export async function assignOrganizationPlan(input: {
  organizationId: string;
  planKey: string;
  status: string;
  billingProvider?: string;
}) {
  await ensurePlansSeeded();
  const plan = await planDefinitionsRepository.findByKey(input.planKey);
  if (!plan) throw new Error("Plan not found");

  return organizationSubscriptionsRepository.upsert({
    id: randomUUID(),
    organizationId: input.organizationId,
    planDefinitionId: plan.id,
    status: input.status,
    billingProvider: input.billingProvider || null,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });
}

export async function getOrganizationUsage(organizationId: string) {
  return usageRecordsRepository.listByOrganization(organizationId);
}
