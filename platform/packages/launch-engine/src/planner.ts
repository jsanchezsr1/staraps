import type { LaunchAsset, LaunchPlan, LaunchReadiness } from "./types";

export async function createLaunchPlan(input: {
  productName: string;
  audience?: string;
}) : Promise<LaunchPlan> {
  return {
    productName: input.productName,
    audience: input.audience || "SMB operators and AI-forward teams",
    positioning: "Focused automation for a specific operational pain point",
    primaryOffer: "Free trial with fast setup",
    launchChannels: ["seo", "landing_page", "email", "social"],
    payloadJson: { source: "launch_engine" }
  };
}

export async function generateLaunchAssets(input: {
  plan: LaunchPlan;
}) : Promise<LaunchAsset[]> {
  const baseSlug = input.plan.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return [
    {
      assetType: "landing_page",
      title: `${input.plan.productName} Landing Page`,
      slug: `${baseSlug}-landing`,
      contentSummary: "Primary landing page with value proposition, CTA, and proof blocks."
    },
    {
      assetType: "seo_page",
      title: `${input.plan.productName} SEO Overview`,
      slug: `${baseSlug}-overview`,
      contentSummary: "SEO-focused page targeting high-intent category keywords."
    },
    {
      assetType: "pricing_page",
      title: `${input.plan.productName} Pricing`,
      slug: `${baseSlug}-pricing`,
      contentSummary: "Pricing page with starter, growth, and premium tiers."
    },
    {
      assetType: "waitlist_page",
      title: `${input.plan.productName} Waitlist`,
      slug: `${baseSlug}-waitlist`,
      contentSummary: "Waitlist capture page for prelaunch acquisition."
    }
  ];
}

export async function createLaunchReadiness(input: {
  plan: LaunchPlan;
  assets: LaunchAsset[];
}) : Promise<LaunchReadiness> {
  return {
    status: "ready_for_launch",
    summary: `${input.plan.productName} has core launch assets prepared and is ready for go-to-market handoff.`,
    checklist: [
      "Landing page ready",
      "SEO page ready",
      "Pricing page ready",
      "Waitlist capture configured",
      "Growth campaign can be created"
    ]
  };
}
