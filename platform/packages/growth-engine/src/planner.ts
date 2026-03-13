import type { GrowthCampaignDefinition } from "./types";

export async function planGrowthCampaign(input: {
  name: string;
  channelType: string;
  objective: string;
}) : Promise<GrowthCampaignDefinition> {
  return {
    name: input.name,
    channelType: input.channelType as any,
    objective: input.objective,
    targetAudience: "SMB operators and AI-forward product teams",
    assetsJson: {
      headline: "Automate your workflow faster",
      cta: "Start free preview",
      landingPageVariant: "lp_v1"
    }
  };
}
