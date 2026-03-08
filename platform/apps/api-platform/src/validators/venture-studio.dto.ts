import { z } from "zod";

export const createVentureRunSchema = z.object({
  opportunityName: z.string().min(1),
  marketCategory: z.string().optional()
});
