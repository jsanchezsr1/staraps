import { z } from "zod";

export const purchaseTemplateSchema = z.object({
  templateDefinitionId: z.string().min(1),
  amountCents: z.number().int().nonnegative(),
  currency: z.string().default("USD"),
  provider: z.string().optional()
});

export const purchasePluginSchema = z.object({
  pluginMarketplaceItemId: z.string().min(1),
  developerId: z.string().optional(),
  amountCents: z.number().int().nonnegative(),
  currency: z.string().default("USD"),
  provider: z.string().optional()
});

export const requestPayoutSchema = z.object({
  developerId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().default("USD"),
  provider: z.string().optional()
});
