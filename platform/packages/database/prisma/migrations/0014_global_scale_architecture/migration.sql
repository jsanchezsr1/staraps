CREATE TABLE "RuntimeRegion" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "cloud" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RegionalDeployment" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "runtimeRegionId" TEXT NOT NULL,
  "environment" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "url" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "EdgeRoutingRule" (
  "id" TEXT PRIMARY KEY,
  "hostname" TEXT NOT NULL UNIQUE,
  "preferredRuntimeRegionId" TEXT NOT NULL,
  "fallbackRuntimeRegionId" TEXT,
  "healthStatus" TEXT NOT NULL,
  "latencyMs" INTEGER,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PlatformServiceHealth" (
  "id" TEXT PRIMARY KEY,
  "serviceName" TEXT NOT NULL,
  "runtimeRegionId" TEXT,
  "status" TEXT NOT NULL,
  "detailsJson" JSONB,
  "checkedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PlatformIncident" (
  "id" TEXT PRIMARY KEY,
  "runtimeRegionId" TEXT,
  "serviceName" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "details" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP
);

CREATE INDEX "RegionalDeployment_project_createdAt_idx"
  ON "RegionalDeployment"("projectId", "createdAt");

CREATE INDEX "PlatformServiceHealth_service_checkedAt_idx"
  ON "PlatformServiceHealth"("serviceName", "checkedAt");

CREATE INDEX "PlatformIncident_service_createdAt_idx"
  ON "PlatformIncident"("serviceName", "createdAt");

ALTER TABLE "RegionalDeployment"
  ADD CONSTRAINT "RegionalDeployment_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RegionalDeployment"
  ADD CONSTRAINT "RegionalDeployment_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RegionalDeployment"
  ADD CONSTRAINT "RegionalDeployment_runtimeRegionId_fkey"
  FOREIGN KEY ("runtimeRegionId") REFERENCES "RuntimeRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EdgeRoutingRule"
  ADD CONSTRAINT "EdgeRoutingRule_preferredRuntimeRegionId_fkey"
  FOREIGN KEY ("preferredRuntimeRegionId") REFERENCES "RuntimeRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EdgeRoutingRule"
  ADD CONSTRAINT "EdgeRoutingRule_fallbackRuntimeRegionId_fkey"
  FOREIGN KEY ("fallbackRuntimeRegionId") REFERENCES "RuntimeRegion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PlatformServiceHealth"
  ADD CONSTRAINT "PlatformServiceHealth_runtimeRegionId_fkey"
  FOREIGN KEY ("runtimeRegionId") REFERENCES "RuntimeRegion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PlatformIncident"
  ADD CONSTRAINT "PlatformIncident_runtimeRegionId_fkey"
  FOREIGN KEY ("runtimeRegionId") REFERENCES "RuntimeRegion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
