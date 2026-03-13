import { z } from "zod";

export const installTemplateSchema = z.object({
  templateKey: z.string().min(1),
  projectName: z.string().min(1).max(120).optional(),
  projectDescription: z.string().max(5000).optional()
});

export const publishTemplateSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  version: z.string().min(1),
  thumbnailUrl: z.string().url().optional(),
  templateSpecJson: z.record(z.any()),
  tagsJson: z.array(z.string()).optional().default([])
});
