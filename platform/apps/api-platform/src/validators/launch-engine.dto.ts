import { z } from "zod";

export const createLaunchRunSchema = z.object({
  ventureBuildRunId: z.string().optional(),
  productName: z.string().min(1),
  audience: z.string().optional()
});
