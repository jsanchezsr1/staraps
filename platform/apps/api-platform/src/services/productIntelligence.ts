import { randomUUID } from "crypto";
import { analyzeProductSignals, recommendOptimizations } from "@platform/product-intelligence";
import {
  optimizationRecommendationRecordsRepository,
  productInsightRunsRepository,
  productSignalRecordsRepository
} from "@platform/database";

export async function createProductInsightRun(input: {
  projectId: string;
  inputMetricsJson?: Record<string, unknown>;
  createdByUserId?: string;
}) {
  const run = await productInsightRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    status: "queued",
    inputMetricsJson: input.inputMetricsJson || null,
    createdByUserId: input.createdByUserId || null
  });

  const signals = await analyzeProductSignals({
    projectId: input.projectId,
    metricsJson: input.inputMetricsJson
  });

  for (const signal of signals) {
    await productSignalRecordsRepository.create({
      id: randomUUID(),
      productInsightRunId: run.id,
      signalType: signal.type,
      title: signal.title,
      description: signal.description,
      severity: signal.severity,
      payloadJson: signal.payloadJson || null
    });
  }

  const recommendations = await recommendOptimizations({ signals });

  for (const rec of recommendations) {
    await optimizationRecommendationRecordsRepository.create({
      id: randomUUID(),
      productInsightRunId: run.id,
      recommendationType: rec.type,
      title: rec.title,
      description: rec.description,
      expectedImpact: rec.expectedImpact,
      payloadJson: rec.payloadJson || null
    });
  }

  await productInsightRunsRepository.update(run.id, {
    status: "completed",
    summaryJson: {
      signalCount: signals.length,
      recommendationCount: recommendations.length
    },
    finishedAt: new Date()
  })

  return productInsightRunsRepository.findById(run.id);
}
