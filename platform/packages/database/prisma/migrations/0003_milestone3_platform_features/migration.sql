CREATE TYPE "PlatformJobType" AS ENUM ('PREVIEW', 'DEPLOYMENT');

CREATE TABLE "PlatformJob" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "requestedByUserId" TEXT,
  "type" "PlatformJobType" NOT NULL,
  "status" TEXT NOT NULL,
  "target" TEXT,
  "log" TEXT,
  "previewUrl" TEXT,
  "deploymentUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "PluginInstallation" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "pluginKey" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "configJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PlatformJob_projectId_createdAt_idx" ON "PlatformJob"("projectId", "createdAt");
CREATE INDEX "PlatformJob_type_status_idx" ON "PlatformJob"("type", "status");
CREATE INDEX "PluginInstallation_organizationId_pluginKey_idx" ON "PluginInstallation"("organizationId", "pluginKey");

ALTER TABLE "PlatformJob"
  ADD CONSTRAINT "PlatformJob_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlatformJob"
  ADD CONSTRAINT "PlatformJob_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PlatformJob"
  ADD CONSTRAINT "PlatformJob_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PluginInstallation"
  ADD CONSTRAINT "PluginInstallation_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
