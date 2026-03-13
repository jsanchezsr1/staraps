import { randomUUID } from "crypto";
import { analyzeGrowthOutcome, planGrowthCampaign } from "@platform/growth-engine";
import {
  growthCampaignsRepository,
  growthExperimentsRepository,
  growthOutcomesRepository,
  trafficSourcesRepository
} from "@platform/database";

export async function seedTrafficSources() {
  const items = [
    ["organic_search", "Organic Search"],
    ["direct", "Direct"],
    ["referral", "Referral"],
    ["social", "Social"],
    ["paid", "Paid"],
    ["email", "Email"]
  ];

  for (const [sourceType, displayName] of items) {
    await trafficSourcesRepository.upsert({
      id: randomUUID(),
      sourceType,
      displayName
    });
  }
}

export async function createGrowthCampaign(input: {
  projectId?: string;
  name: string;
  channelType: string;
  objective: string;
  createdByUserId?: string;
}) {
  await seedTrafficSources();

  const definition = await planGrowthCampaign({
    name: input.name,
    channelType: input.channelType,
    objective: input.objective
  });

  const campaign = await growthCampaignsRepository.create({
    id: randomUUID(),
    projectId: input.projectId || null,
    name: input.name,
    channelType: input.channelType,
    status: "draft",
    objective: input.objective,
    definitionJson: definition,
    createdByUserId: input.createdByUserId || null
  });

  await growthExperimentsRepository.create({
    id: randomUUID(),
    growthCampaignId: campaign.id,
    name: `${input.name} primary experiment`,
    hypothesis: "Variant assets improve acquisition efficiency.",
    variantJson: {
      control: "asset_v1",
      variant: "asset_v2"
    }
  });

  return campaign;
}

export async function analyzeGrowthCampaign(input: {
  growthCampaignId: string;
}) {
  const outcome = await analyzeGrowthOutcome({
    growthCampaignId: input.growthCampaignId
  });

  const sources = await trafficSourcesRepository.listAll();
  const trafficSourceId = sources.length > 0 ? sources[0].id : null;

  await growthOutcomesRepository.create({
    id: randomUUID(),
    growthCampaignId: input.growthCampaignId,
    trafficSourceId,
    sessions: outcome.sessions,
    conversions: outcome.conversions,
    revenue: outcome.revenue,
    summary: outcome.summary
  });

  await growthCampaignsRepository.update(input.growthCampaignId, {
    status: outcome.status,
    finishedAt: new Date()
  });

  return growthCampaignsRepository.findById(input.growthCampaignId);
}
