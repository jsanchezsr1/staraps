CREATE TABLE "TrafficSource" (
  "id" TEXT PRIMARY KEY,
  "sourceType" TEXT NOT NULL UNIQUE,
  "displayName" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GrowthCampaign" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT,
  "name" TEXT NOT NULL,
  "channelType" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "definitionJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "GrowthExperiment" (
  "id" TEXT PRIMARY KEY,
  "growthCampaignId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "hypothesis" TEXT,
  "variantJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GrowthOutcome" (
  "id" TEXT PRIMARY KEY,
  "growthCampaignId" TEXT NOT NULL,
  "trafficSourceId" TEXT,
  "sessions" INTEGER NOT NULL DEFAULT 0,
  "conversions" INTEGER NOT NULL DEFAULT 0,
  "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "GrowthCampaign_project_createdAt_idx"
  ON "GrowthCampaign"("projectId", "createdAt");

CREATE INDEX "GrowthExperiment_campaign_createdAt_idx"
  ON "GrowthExperiment"("growthCampaignId", "createdAt");

CREATE INDEX "GrowthOutcome_campaign_createdAt_idx"
  ON "GrowthOutcome"("growthCampaignId", "createdAt");

ALTER TABLE "GrowthCampaign"
  ADD CONSTRAINT "GrowthCampaign_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GrowthCampaign"
  ADD CONSTRAINT "GrowthCampaign_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GrowthExperiment"
  ADD CONSTRAINT "GrowthExperiment_growthCampaignId_fkey"
  FOREIGN KEY ("growthCampaignId") REFERENCES "GrowthCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GrowthOutcome"
  ADD CONSTRAINT "GrowthOutcome_growthCampaignId_fkey"
  FOREIGN KEY ("growthCampaignId") REFERENCES "GrowthCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GrowthOutcome"
  ADD CONSTRAINT "GrowthOutcome_trafficSourceId_fkey"
  FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
