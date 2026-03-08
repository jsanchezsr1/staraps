import { z } from "zod";

export const scanMarketDiscoverySchema = z.object({
  projectId: z.string().optional(),
  seedKeywords: z.array(z.string()).optional()
});
