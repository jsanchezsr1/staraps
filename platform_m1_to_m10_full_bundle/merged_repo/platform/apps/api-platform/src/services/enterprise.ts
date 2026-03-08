import { randomUUID } from "crypto";
import {
  environmentPromotionsRepository,
  organizationSsoConfigRepository,
  projectApprovalRequestsRepository,
  scimProvisioningRepository
} from "@platform/database";

export async function upsertOrganizationSsoConfig(input: {
  organizationId: string;
  providerType: string;
  entryPoint?: string;
  issuer?: string;
  audience?: string;
  certificate?: string;
  enabled?: boolean;
}) {
  return organizationSsoConfigRepository.upsert({
    id: randomUUID(),
    organizationId: input.organizationId,
    providerType: input.providerType,
    entryPoint: input.entryPoint || null,
    issuer: input.issuer || null,
    audience: input.audience || null,
    certificate: input.certificate || null,
    enabled: input.enabled ?? true
  });
}

export async function upsertScimConfig(input: {
  organizationId: string;
  tokenHash?: string;
  baseUrl?: string;
  enabled?: boolean;
}) {
  return scimProvisioningRepository.upsertConfig({
    id: randomUUID(),
    organizationId: input.organizationId,
    tokenHash: input.tokenHash || null,
    baseUrl: input.baseUrl || null,
    enabled: input.enabled ?? true
  });
}

export async function createEnvironmentPromotion(input: {
  projectId: string;
  projectVersionId?: string;
  fromEnvironment: string;
  toEnvironment: string;
  requestedByUserId?: string;
}) {
  return environmentPromotionsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    fromEnvironment: input.fromEnvironment,
    toEnvironment: input.toEnvironment,
    status: "pending",
    requestedByUserId: input.requestedByUserId || null
  });
}

export async function approveEnvironmentPromotion(input: {
  id: string;
  approvedByUserId?: string;
}) {
  return environmentPromotionsRepository.approve(input.id, input.approvedByUserId || null);
}

export async function createApprovalRequest(input: {
  projectId: string;
  projectVersionId?: string;
  requestedByUserId?: string;
  notes?: string;
}) {
  return projectApprovalRequestsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    status: "pending",
    requestedByUserId: input.requestedByUserId || null,
    notes: input.notes || null
  });
}

export async function approveApprovalRequest(input: {
  id: string;
  approvedByUserId?: string;
}) {
  return projectApprovalRequestsRepository.approve(input.id, input.approvedByUserId || null);
}
