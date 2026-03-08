import { z } from "zod";

export const upsertSsoConfigSchema = z.object({
  providerType: z.enum(["saml", "oidc"]),
  entryPoint: z.string().optional(),
  issuer: z.string().optional(),
  audience: z.string().optional(),
  certificate: z.string().optional(),
  enabled: z.boolean().optional()
});

export const upsertScimConfigSchema = z.object({
  tokenHash: z.string().optional(),
  baseUrl: z.string().optional(),
  enabled: z.boolean().optional()
});

export const createEnvironmentPromotionSchema = z.object({
  projectVersionId: z.string().optional(),
  fromEnvironment: z.string().min(1),
  toEnvironment: z.string().min(1)
});

export const createApprovalRequestSchema = z.object({
  projectVersionId: z.string().optional(),
  notes: z.string().max(10000).optional()
});
