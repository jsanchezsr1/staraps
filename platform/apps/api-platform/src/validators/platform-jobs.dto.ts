import { z } from "zod";

export const createPreviewJobSchema = z.object({
  versionId: z.string().min(1)
});

export const createDeploymentJobSchema = z.object({
  versionId: z.string().min(1),
  target: z.string().min(1).default("local-docker")
});

export const aiSpecDraftSchema = z.object({
  prompt: z.string().min(20).max(10000),
  nameHint: z.string().min(1).max(120).optional()
});
