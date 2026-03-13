import type { VentureThesis, StartupConcept, VentureScorecard } from "./types";

export async function createVentureThesis(input: {
  opportunityName: string;
  marketCategory?: string;
}) : Promise<VentureThesis> {
  return {
    title: input.opportunityName,
    problem: "Teams lack a focused workflow tool for a specific high-friction niche.",
    targetCustomer: "SMB operators with repetitive manual workflows.",
    wedge: "AI-assisted automation with deployable workflow templates.",
    marketCategory: input.marketCategory || "workflow automation",
    payloadJson: { source: "venture_studio" }
  };
}

export async function createStartupConcept(input: {
  thesis: VentureThesis;
}) : Promise<StartupConcept> {
  return {
    name: `${input.thesis.marketCategory} Studio App`,
    summary: `A focused SaaS product built around the thesis: ${input.thesis.title}.`,
    pricingModel: "Subscription",
    distributionModel: "SEO + outbound + partner referrals",
    moat: "Workflow data, templates, and distribution specialization",
    payloadJson: { thesisTitle: input.thesis.title }
  };
}

export async function scoreVentureConcept(input: {
  thesis: VentureThesis;
  concept: StartupConcept;
}) : Promise<VentureScorecard> {
  return {
    marketScore: 82,
    speedToBuildScore: 88,
    monetizationScore: 79,
    defensibilityScore: 72,
    overallScore: 80,
    summary: `The concept ${input.concept.name} scores well on speed and monetization potential.`
  };
}
