import { z } from "zod";

export const createProjectSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(5000).optional()
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(5000).nullable().optional(),
  latestVersionId: z.string().nullable().optional()
});

export const generateProjectSchema = z.object({
  versionId: z.string().min(1)
});
