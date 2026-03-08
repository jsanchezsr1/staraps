import { z } from "zod";

export const createDeploymentPlanSchema = z.object({
  projectVersionId: z.string().optional(),
  environmentType: z.enum(["preview", "staging", "production"]).default("preview")
});

export const createDeploymentRunSchema = z.object({
  projectVersionId: z.string().optional(),
  environmentType: z.enum(["preview", "staging", "production"]).default("preview")
});

export const rollbackDeploymentRunSchema = z.object({
  reason: z.string().optional()
});
