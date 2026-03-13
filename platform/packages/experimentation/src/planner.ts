import type { ExperimentHypothesis, ExperimentVariant } from "./types";

export async function planExperiment(input: {
  name: string;
  targetMetric: string;
}) {
  const hypothesis: ExperimentHypothesis = {
    title: `Improve ${input.targetMetric}`,
    description: `Test whether a controlled change improves ${input.targetMetric}.`,
    targetMetric: input.targetMetric as any,
    expectedLiftPercent: 8
  };

  const variants: ExperimentVariant[] = [
    {
      key: "control",
      title: "Control",
      description: "Current experience",
      trafficPercent: 50
    },
    {
      key: "variant_a",
      title: "Variant A",
      description: "Improved experience",
      trafficPercent: 50,
      payloadJson: { change: "optimized_ui" }
    }
  ];

  return { hypothesis, variants };
}
