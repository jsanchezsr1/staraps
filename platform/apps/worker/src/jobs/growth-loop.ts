export async function runGrowthLoopJob(input: {
  growthCampaignId: string;
}) {
  return {
    growthCampaignId: input.growthCampaignId,
    status: "completed",
    distributed: true
  };
}
