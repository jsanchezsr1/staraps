import { z } from "zod";

export const createVentureAutopilotRunSchema = z.object({
  opportunityName: z.string().min(1),
  marketCategory: z.string().optional(),
  performanceScore: z.number().optional()
});
