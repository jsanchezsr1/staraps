import { randomUUID } from "crypto";
import {
  createLaunchPlan,
  createLaunchReadiness,
  generateLaunchAssets
} from "@platform/launch-engine";
import {
  launchAssetRecordsRepository,
  launchCampaignRecordsRepository,
  launchRunsRepository
} from "@platform/database";

export async function createLaunchRun(input: {
  ventureBuildRunId?: string;
  productName: string;
  audience?: string;
  createdByUserId?: string;
}) {
  const run = await launchRunsRepository.create({
    id: randomUUID(),
    ventureBuildRunId: input.ventureBuildRunId || null,
    status: "planning",
    createdByUserId: input.createdByUserId || null,
    startedAt: new Date()
  });

  const plan = await createLaunchPlan({
    productName: input.productName,
    audience: input.audience
  });

  const assets = await generateLaunchAssets({ plan });
  const readiness = await createLaunchReadiness({ plan, assets });

  for (const asset of assets) {
    await launchAssetRecordsRepository.create({
      id: randomUUID(),
      launchRunId: run.id,
      assetType: asset.assetType,
      title: asset.title,
      slug: asset.slug,
      contentSummary: asset.contentSummary,
      payloadJson: asset.payloadJson || null
    });
  }

  for (const channel of plan.launchChannels) {
    await launchCampaignRecordsRepository.create({
      id: randomUUID(),
      launchRunId: run.id,
      channel,
      title: `${input.productName} ${channel} launch`,
      status: "draft",
      payloadJson: { productName: input.productName, channel }
    });
  }

  await launchRunsRepository.update(run.id, {
    status: "completed",
    planJson: plan,
    readinessJson: readiness,
    finishedAt: new Date()
  });

  return launchRunsRepository.findById(run.id);
}
