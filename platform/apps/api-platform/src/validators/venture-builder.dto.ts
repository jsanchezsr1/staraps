import { z } from "zod";

export const createVentureBuildRunSchema = z.object({
  ventureIdeaId: z.string().optional(),
  ventureName: z.string().min(1),
  marketCategory: z.string().optional()
});
