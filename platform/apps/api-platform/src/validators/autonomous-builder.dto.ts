import { z } from "zod";

export const createAutonomousRunSchema = z.object({
  organizationId: z.string().optional(),
  projectId: z.string().optional(),
  prompt: z.string().min(10)
});
