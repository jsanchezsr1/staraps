export async function estimateUsageCost(input: {
  promptTokens: number;
  completionTokens: number;
  promptRateUsdPer1k?: number;
  completionRateUsdPer1k?: number;
}) {
  const promptRate = input.promptRateUsdPer1k ?? 0.005;
  const completionRate = input.completionRateUsdPer1k ?? 0.015;

  const promptCost = (input.promptTokens / 1000) * promptRate;
  const completionCost = (input.completionTokens / 1000) * completionRate;

  return {
    promptCostUsd: promptCost,
    completionCostUsd: completionCost,
    totalCostUsd: promptCost + completionCost
  };
}
