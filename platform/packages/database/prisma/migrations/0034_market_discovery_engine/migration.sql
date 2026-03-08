CREATE TABLE "TrendSource" (
  "id" TEXT PRIMARY KEY,
  "sourceType" TEXT NOT NULL UNIQUE,
  "displayName" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MarketSignal" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT,
  "trendSourceId" TEXT,
  "keyword" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "strength" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OpportunityCluster" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "keywordsJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OpportunityScore" (
  "id" TEXT PRIMARY KEY,
  "opportunityClusterId" TEXT NOT NULL,
  "demandScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "competitionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "opportunityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "MarketSignal_project_createdAt_idx"
  ON "MarketSignal"("projectId", "createdAt");

CREATE INDEX "OpportunityCluster_project_createdAt_idx"
  ON "OpportunityCluster"("projectId", "createdAt");

CREATE INDEX "OpportunityScore_cluster_createdAt_idx"
  ON "OpportunityScore"("opportunityClusterId", "createdAt");

ALTER TABLE "MarketSignal"
  ADD CONSTRAINT "MarketSignal_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketSignal"
  ADD CONSTRAINT "MarketSignal_trendSourceId_fkey"
  FOREIGN KEY ("trendSourceId") REFERENCES "TrendSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OpportunityCluster"
  ADD CONSTRAINT "OpportunityCluster_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OpportunityScore"
  ADD CONSTRAINT "OpportunityScore_opportunityClusterId_fkey"
  FOREIGN KEY ("opportunityClusterId") REFERENCES "OpportunityCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
