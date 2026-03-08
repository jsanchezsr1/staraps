import { z } from "zod";

export const createPluginDeveloperSchema = z.object({
  displayName: z.string().min(1),
  slug: z.string().min(1),
  bio: z.string().max(5000).optional(),
  websiteUrl: z.string().url().optional()
});

export const publishPluginSchema = z.object({
  developerId: z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  description: z.string().max(10000).optional(),
  permissionsJson: z.array(z.string()).default([]),
  manifestJson: z.record(z.any()),
  thumbnailUrl: z.string().url().optional()
});

export const publishPluginVersionSchema = z.object({
  pluginMarketplaceItemId: z.string().min(1),
  version: z.string().min(1),
  changelog: z.string().max(10000).optional(),
  packageUrl: z.string().url().optional(),
  manifestJson: z.record(z.any())
});

export const ratePluginSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().max(5000).optional()
});
