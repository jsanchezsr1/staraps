import type { ProductSignal, OptimizationRecommendation } from "./types";

export async function analyzeProductSignals(input: {
  projectId: string;
  metricsJson?: Record<string, unknown>;
}) : Promise<ProductSignal[]> {
  return [
    {
      type: "high_friction",
      title: "Onboarding friction detected",
      description: "Users appear to drop during the first-run setup sequence.",
      severity: "high",
      payloadJson: { funnelStep: "onboarding_step_2" }
    },
    {
      type: "feature_adoption_gap",
      title: "Core feature adoption gap",
      description: "A primary feature is under-adopted relative to benchmark expectations.",
      severity: "medium",
      payloadJson: { feature: "dashboard_reports" }
    }
  ];
}

export async function recommendOptimizations(input: {
  signals: ProductSignal[];
}) : Promise<OptimizationRecommendation[]> {
  const recommendations: OptimizationRecommendation[] = [];

  for (const signal of input.signals) {
    if (signal.type === "high_friction") {
      recommendations.push({
        type: "onboarding_change",
        title: "Simplify onboarding step flow",
        description: "Reduce steps and defer non-critical setup fields.",
        expectedImpact: "high",
        payloadJson: signal.payloadJson
      });
    } else if (signal.type === "feature_adoption_gap") {
      recommendations.push({
        type: "feature_experiment",
        title: "Promote feature discovery",
        description: "Test in-product prompts and dashboard spotlight banners.",
        expectedImpact: "medium",
        payloadJson: signal.payloadJson
      });
    } else {
      recommendations.push({
        type: "ui_change",
        title: "General UX optimization",
        description: "Apply a UI improvement based on observed usage patterns.",
        expectedImpact: "medium",
        payloadJson: signal.payloadJson
      });
    }
  }

  return recommendations;
}
