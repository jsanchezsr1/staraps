import { z } from "zod";

export const createGrowthCampaignSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(1),
  channelType: z.enum(["seo", "landing_page", "email", "paid_ads", "referral", "viral_loop", "social"]),
  objective: z.string().min(1)
});
