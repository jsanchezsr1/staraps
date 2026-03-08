CREATE TABLE "OrganizationSSOConfig" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL UNIQUE,
  "providerType" TEXT NOT NULL,
  "entryPoint" TEXT,
  "issuer" TEXT,
  "audience" TEXT,
  "certificate" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ScimProvisioningConfig" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL UNIQUE,
  "tokenHash" TEXT,
  "baseUrl" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ScimProvisioningEvent" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payloadJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "EnvironmentPromotion" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "fromEnvironment" TEXT NOT NULL,
  "toEnvironment" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "status" TEXT NOT NULL,
  "requestedByUserId" TEXT,
  "approvedByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ProjectApprovalRequest" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "status" TEXT NOT NULL,
  "requestedByUserId" TEXT,
  "approvedByUserId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "ScimProvisioningEvent_org_createdAt_idx"
  ON "ScimProvisioningEvent"("organizationId", "createdAt");

CREATE INDEX "EnvironmentPromotion_project_createdAt_idx"
  ON "EnvironmentPromotion"("projectId", "createdAt");

CREATE INDEX "ProjectApprovalRequest_project_createdAt_idx"
  ON "ProjectApprovalRequest"("projectId", "createdAt");

ALTER TABLE "OrganizationSSOConfig"
  ADD CONSTRAINT "OrganizationSSOConfig_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ScimProvisioningConfig"
  ADD CONSTRAINT "ScimProvisioningConfig_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ScimProvisioningEvent"
  ADD CONSTRAINT "ScimProvisioningEvent_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EnvironmentPromotion"
  ADD CONSTRAINT "EnvironmentPromotion_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EnvironmentPromotion"
  ADD CONSTRAINT "EnvironmentPromotion_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EnvironmentPromotion"
  ADD CONSTRAINT "EnvironmentPromotion_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EnvironmentPromotion"
  ADD CONSTRAINT "EnvironmentPromotion_approvedByUserId_fkey"
  FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectApprovalRequest"
  ADD CONSTRAINT "ProjectApprovalRequest_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectApprovalRequest"
  ADD CONSTRAINT "ProjectApprovalRequest_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectApprovalRequest"
  ADD CONSTRAINT "ProjectApprovalRequest_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectApprovalRequest"
  ADD CONSTRAINT "ProjectApprovalRequest_approvedByUserId_fkey"
  FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
