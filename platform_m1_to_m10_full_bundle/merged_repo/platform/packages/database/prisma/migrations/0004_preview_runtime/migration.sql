CREATE TABLE "PreviewEnvironment" (
  "id" TEXT PRIMARY KEY,
  "platformJobId" TEXT NOT NULL UNIQUE,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "runtimeType" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "containerId" TEXT,
  "host" TEXT,
  "port" INTEGER,
  "previewUrl" TEXT,
  "artifactCacheKey" TEXT,
  "startedAt" TIMESTAMP,
  "expiresAt" TIMESTAMP,
  "stoppedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PreviewEnvironment_projectId_createdAt_idx"
  ON "PreviewEnvironment"("projectId", "createdAt");

CREATE INDEX "PreviewEnvironment_status_expiresAt_idx"
  ON "PreviewEnvironment"("status", "expiresAt");

ALTER TABLE "PreviewEnvironment"
  ADD CONSTRAINT "PreviewEnvironment_platformJobId_fkey"
  FOREIGN KEY ("platformJobId") REFERENCES "PlatformJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PreviewEnvironment"
  ADD CONSTRAINT "PreviewEnvironment_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PreviewEnvironment"
  ADD CONSTRAINT "PreviewEnvironment_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
