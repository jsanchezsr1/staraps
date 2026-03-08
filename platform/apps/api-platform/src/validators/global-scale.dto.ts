import { z } from "zod";

export const createRuntimeRegionSchema = z.object({
  key: z.string().min(1),
  cloud: z.string().min(1),
  displayName: z.string().min(1),
  isPrimary: z.boolean().optional(),
  isEnabled: z.boolean().optional()
});

export const createRegionalDeploymentSchema = z.object({
  projectVersionId: z.string().optional(),
  runtimeRegionKey: z.string().min(1),
  environment: z.string().min(1),
  status: z.string().min(1),
  url: z.string().optional()
});

export const upsertEdgeRoutingRuleSchema = z.object({
  hostname: z.string().min(1),
  preferredRuntimeRegionKey: z.string().min(1),
  fallbackRuntimeRegionKey: z.string().optional(),
  healthStatus: z.string().min(1),
  latencyMs: z.number().int().optional()
});

export const reportServiceHealthSchema = z.object({
  serviceName: z.string().min(1),
  runtimeRegionKey: z.string().optional(),
  status: z.string().min(1),
  detailsJson: z.record(z.any()).optional()
});

export const createIncidentSchema = z.object({
  runtimeRegionKey: z.string().optional(),
  serviceName: z.string().min(1),
  severity: z.string().min(1),
  status: z.string().default("open"),
  summary: z.string().min(1),
  details: z.string().optional()
});
