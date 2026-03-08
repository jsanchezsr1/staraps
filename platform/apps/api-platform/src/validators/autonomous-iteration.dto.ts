import { z } from "zod";

export const createIterationRunSchema = z.object({
  projectVersionId: z.string().optional(),
  contextJson: z.record(z.any()).optional()
});
