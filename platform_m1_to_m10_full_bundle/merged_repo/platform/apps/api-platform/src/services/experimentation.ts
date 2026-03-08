import { randomUUID } from "crypto";
import { analyzeExperimentResults, planExperiment } from "@platform/experimentation";
import {
  experimentResultsRepository,
  experimentsRepository,
  experimentVariantsRepository
} from "@platform/database";

export async function createExperiment(input: {
  projectId: string;
  name: string;
  targetMetric: string;
  createdByUserId?: string;
}) {
  const plan = await planExperiment({
    name: input.name,
    targetMetric: input.targetMetric
  });

  const experiment = await experimentsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    name: input.name,
    status: "draft",
    targetMetric: input.targetMetric,
    hypothesisJson: plan.hypothesis,
    createdByUserId: input.createdByUserId || null
  });

  for (const variant of plan.variants) {
    await experimentVariantsRepository.create({
      id: randomUUID(),
      experimentId: experiment.id,
      variantKey: variant.key,
      title: variant.title,
      description: variant.description || null,
      payloadJson: variant.payloadJson || null,
      trafficPercent: variant.trafficPercent
    });
  }

  return experiment;
}

export async function analyzeExperiment(input: {
  experimentId: string;
}) {
  const result = await analyzeExperimentResults({
    experimentId: input.experimentId
  });

  await experimentResultsRepository.create({
    id: randomUUID(),
    experimentId: input.experimentId,
    variantKey: result.winningVariantKey || null,
    metricName: "summary_confidence",
    metricValue: result.confidence || 0
  });

  await experimentsRepository.update(input.experimentId, {
    status: result.status,
    summaryJson: result,
    finishedAt: new Date()
  });

  return experimentsRepository.findById(input.experimentId);
}
