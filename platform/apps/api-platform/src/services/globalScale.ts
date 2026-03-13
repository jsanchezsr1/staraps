import { randomUUID } from "crypto";
import {
  edgeRoutingRulesRepository,
  platformIncidentsRepository,
  platformServiceHealthRepository,
  regionalDeploymentsRepository,
  runtimeRegionsRepository
} from "@platform/database";

export async function createRuntimeRegion(input: {
  key: string;
  cloud: string;
  displayName: string;
  isPrimary?: boolean;
  isEnabled?: boolean;
}) {
  return runtimeRegionsRepository.create({
    id: randomUUID(),
    key: input.key,
    cloud: input.cloud,
    displayName: input.displayName,
    isPrimary: input.isPrimary ?? false,
    isEnabled: input.isEnabled ?? true
  });
}

export async function createRegionalDeployment(input: {
  projectId: string;
  projectVersionId?: string;
  runtimeRegionKey: string;
  environment: string;
  status: string;
  url?: string;
}) {
  const region = await runtimeRegionsRepository.findByKey(input.runtimeRegionKey);
  if (!region) {
    throw new Error("Runtime region not found");
  }

  return regionalDeploymentsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    runtimeRegionId: region.id,
    environment: input.environment,
    status: input.status,
    url: input.url || null
  });
}

export async function upsertEdgeRoutingRule(input: {
  hostname: string;
  preferredRuntimeRegionKey: string;
  fallbackRuntimeRegionKey?: string;
  healthStatus: string;
  latencyMs?: number;
}) {
  const preferred = await runtimeRegionsRepository.findByKey(input.preferredRuntimeRegionKey);
  if (!preferred) {
    throw new Error("Preferred runtime region not found");
  }

  const fallback = input.fallbackRuntimeRegionKey
    ? await runtimeRegionsRepository.findByKey(input.fallbackRuntimeRegionKey)
    : null;

  return edgeRoutingRulesRepository.upsert({
    id: randomUUID(),
    hostname: input.hostname,
    preferredRuntimeRegionId: preferred.id,
    fallbackRuntimeRegionId: fallback?.id || null,
    healthStatus: input.healthStatus,
    latencyMs: input.latencyMs || null
  });
}

export async function reportPlatformServiceHealth(input: {
  serviceName: string;
  runtimeRegionKey?: string;
  status: string;
  detailsJson?: Record<string, unknown>;
}) {
  const region = input.runtimeRegionKey
    ? await runtimeRegionsRepository.findByKey(input.runtimeRegionKey)
    : null;

  return platformServiceHealthRepository.create({
    id: randomUUID(),
    serviceName: input.serviceName,
    runtimeRegionId: region?.id || null,
    status: input.status,
    detailsJson: input.detailsJson || null
  });
}

export async function createPlatformIncident(input: {
  runtimeRegionKey?: string;
  serviceName: string;
  severity: string;
  status: string;
  summary: string;
  details?: string;
}) {
  const region = input.runtimeRegionKey
    ? await runtimeRegionsRepository.findByKey(input.runtimeRegionKey)
    : null;

  return platformIncidentsRepository.create({
    id: randomUUID(),
    runtimeRegionId: region?.id || null,
    serviceName: input.serviceName,
    severity: input.severity,
    status: input.status,
    summary: input.summary,
    details: input.details || null
  });
}

export async function runReconciliationScaffold() {
  return {
    checked: [
      "failed_deployment",
      "orphan_preview",
      "billing_mismatch",
      "stuck_generation_job"
    ],
    status: "completed"
  };
}
