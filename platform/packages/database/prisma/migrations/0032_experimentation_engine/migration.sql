CREATE TABLE "Experiment" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "targetMetric" TEXT NOT NULL,
  "hypothesisJson" JSONB,
  "summaryJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "ExperimentVariantRecord" (
  "id" TEXT PRIMARY KEY,
  "experimentId" TEXT NOT NULL,
  "variantKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "payloadJson" JSONB,
  "trafficPercent" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ExperimentResultRecord" (
  "id" TEXT PRIMARY KEY,
  "experimentId" TEXT NOT NULL,
  "variantKey" TEXT,
  "metricName" TEXT NOT NULL,
  "metricValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Experiment_project_createdAt_idx"
  ON "Experiment"("projectId", "createdAt");

CREATE INDEX "ExperimentVariantRecord_experiment_createdAt_idx"
  ON "ExperimentVariantRecord"("experimentId", "createdAt");

CREATE INDEX "ExperimentResultRecord_experiment_createdAt_idx"
  ON "ExperimentResultRecord"("experimentId", "createdAt");

ALTER TABLE "Experiment"
  ADD CONSTRAINT "Experiment_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Experiment"
  ADD CONSTRAINT "Experiment_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ExperimentVariantRecord"
  ADD CONSTRAINT "ExperimentVariantRecord_experimentId_fkey"
  FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExperimentResultRecord"
  ADD CONSTRAINT "ExperimentResultRecord_experimentId_fkey"
  FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
