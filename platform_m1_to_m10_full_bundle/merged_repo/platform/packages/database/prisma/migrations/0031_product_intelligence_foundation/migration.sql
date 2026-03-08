CREATE TABLE "ProductInsightRun" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "inputMetricsJson" JSONB,
  "summaryJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "ProductSignalRecord" (
  "id" TEXT PRIMARY KEY,
  "productInsightRunId" TEXT NOT NULL,
  "signalType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OptimizationRecommendationRecord" (
  "id" TEXT PRIMARY KEY,
  "productInsightRunId" TEXT NOT NULL,
  "recommendationType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "expectedImpact" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "ProductInsightRun_project_createdAt_idx"
  ON "ProductInsightRun"("projectId", "createdAt");

CREATE INDEX "ProductSignalRecord_run_createdAt_idx"
  ON "ProductSignalRecord"("productInsightRunId", "createdAt");

CREATE INDEX "OptimizationRecommendationRecord_run_createdAt_idx"
  ON "OptimizationRecommendationRecord"("productInsightRunId", "createdAt");

ALTER TABLE "ProductInsightRun"
  ADD CONSTRAINT "ProductInsightRun_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductInsightRun"
  ADD CONSTRAINT "ProductInsightRun_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductSignalRecord"
  ADD CONSTRAINT "ProductSignalRecord_productInsightRunId_fkey"
  FOREIGN KEY ("productInsightRunId") REFERENCES "ProductInsightRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OptimizationRecommendationRecord"
  ADD CONSTRAINT "OptimizationRecommendationRecord_productInsightRunId_fkey"
  FOREIGN KEY ("productInsightRunId") REFERENCES "ProductInsightRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
