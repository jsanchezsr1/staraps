import { z } from "zod";

export const createRepairRunSchema = z.object({
  projectVersionId: z.string().optional(),
  diagnostics: z.array(z.string()).optional()
});
