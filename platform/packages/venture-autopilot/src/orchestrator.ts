import type {
  VentureAutopilotSummary,
  VentureLifecycleDecision,
  VentureLoopPlan
} from "./types";

export async function createVentureLoopPlan(input: {
  opportunityName: string;
  marketCategory?: string;
}) : Promise<VentureLoopPlan> {
  return {
    opportunityName: input.opportunityName,
    marketCategory: input.marketCategory || "workflow automation",
    ventureName: `${input.opportunityName} Venture`,
    launchMode: "autonomous",
    payloadJson: { source: "venture_autopilot" }
  };
}

export async function determineLifecycleDecision(input: {
  ventureName: string;
  performanceScore?: number;
}) : Promise<VentureLifecycleDecision> {
  const score = input.performanceScore ?? 78;

  if (score >= 85) {
    return {
      decisionType: "scale",
      title: "Scale venture",
      description: "Increase launch intensity and growth allocation.",
      rationale: "Performance exceeded the internal threshold for expansion."
    };
  }

  if (score >= 70) {
    return {
      decisionType: "hold",
      title: "Hold and observe",
      description: "Maintain the current configuration while collecting more data.",
      rationale: "Performance is promising but not yet decisive."
    };
  }

  if (score >= 50) {
    return {
      decisionType: "pivot",
      title: "Pivot venture",
      description: "Adjust positioning, offer, or target market and rerun launch tests.",
      rationale: "Performance indicates misalignment rather than no demand."
    };
  }

  return {
    decisionType: "shutdown",
    title: "Shutdown venture",
    description: "Deprioritize this venture and reallocate effort elsewhere.",
    rationale: "Performance fell below the minimum continuation threshold."
  };
}

export async function summarizeAutopilotRun(input: {
  ventureName: string;
  decision: VentureLifecycleDecision;
}) : Promise<VentureAutopilotSummary> {
  return {
    status: "completed",
    ventureName: input.ventureName,
    summary: `Autopilot completed for ${input.ventureName} with decision: ${input.decision.decisionType}.`,
    nextActions: [
      `Apply decision: ${input.decision.title}`,
      "Sync portfolio records",
      "Schedule next review cycle"
    ]
  };
}
