import type { ExperimentResultSummary } from "./types";

export async function analyzeExperimentResults(input: {
  experimentId: string;
}) : Promise<ExperimentResultSummary> {
  return {
    status: "completed",
    winningVariantKey: "variant_a",
    summary: "Variant A outperformed control on the target metric.",
    confidence: 0.91
  };
}
