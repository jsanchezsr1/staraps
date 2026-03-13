import { z } from "zod";

export const assignPlanSchema = z.object({
  planKey: z.string().min(1),
  status: z.string().default("active"),
  billingProvider: z.string().optional()
});
