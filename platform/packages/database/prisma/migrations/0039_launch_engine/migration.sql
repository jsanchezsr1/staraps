CREATE TABLE "LaunchRun" (
  "id" TEXT PRIMARY KEY,
  "ventureBuildRunId" TEXT,
  "status" TEXT NOT NULL,
  "planJson" JSONB,
  "readinessJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "LaunchAssetRecord" (
  "id" TEXT PRIMARY KEY,
  "launchRunId" TEXT NOT NULL,
  "assetType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "contentSummary" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LaunchCampaignRecord" (
  "id" TEXT PRIMARY KEY,
  "launchRunId" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "LaunchRun_createdAt_idx"
  ON "LaunchRun"("createdAt");

CREATE INDEX "LaunchAssetRecord_run_createdAt_idx"
  ON "LaunchAssetRecord"("launchRunId", "createdAt");

CREATE INDEX "LaunchCampaignRecord_run_createdAt_idx"
  ON "LaunchCampaignRecord"("launchRunId", "createdAt");

ALTER TABLE "LaunchRun"
  ADD CONSTRAINT "LaunchRun_ventureBuildRunId_fkey"
  FOREIGN KEY ("ventureBuildRunId") REFERENCES "VentureBuildRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LaunchRun"
  ADD CONSTRAINT "LaunchRun_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LaunchAssetRecord"
  ADD CONSTRAINT "LaunchAssetRecord_launchRunId_fkey"
  FOREIGN KEY ("launchRunId") REFERENCES "LaunchRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LaunchCampaignRecord"
  ADD CONSTRAINT "LaunchCampaignRecord_launchRunId_fkey"
  FOREIGN KEY ("launchRunId") REFERENCES "LaunchRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
