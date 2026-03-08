import { z } from "zod";

export const publishTemplateVersionSchema = z.object({
  templateDefinitionId: z.string().min(1),
  version: z.string().min(1),
  changelog: z.string().max(10000).optional(),
  templateSpecJson: z.record(z.any())
});

export const rateTemplateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().max(5000).optional()
});

export const searchTemplatesSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
});
