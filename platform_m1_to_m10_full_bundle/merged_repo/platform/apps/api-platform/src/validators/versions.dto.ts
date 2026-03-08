import { z } from "zod";

export const createVersionSchema = z.object({
  appSpecJson: z.unknown(),
  notes: z.string().max(1000).optional()
});
