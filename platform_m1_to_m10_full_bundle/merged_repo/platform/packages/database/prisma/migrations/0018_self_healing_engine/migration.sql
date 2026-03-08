CREATE TABLE "RepairRun" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "requestedByUserId" TEXT,
  "status" TEXT NOT NULL,
  "diagnosticsJson" JSONB,
  "resultJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "RepairActionRecord" (
  "id" TEXT PRIMARY KEY,
  "repairRunId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RepairDiagnosticRecord" (
  "id" TEXT PRIMARY KEY,
  "repairRunId" TEXT NOT NULL,
  "diagnosticType" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "RepairRun_project_createdAt_idx"
  ON "RepairRun"("projectId", "createdAt");

CREATE INDEX "RepairActionRecord_run_createdAt_idx"
  ON "RepairActionRecord"("repairRunId", "createdAt");

CREATE INDEX "RepairDiagnosticRecord_run_createdAt_idx"
  ON "RepairDiagnosticRecord"("repairRunId", "createdAt");

ALTER TABLE "RepairRun"
  ADD CONSTRAINT "RepairRun_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RepairRun"
  ADD CONSTRAINT "RepairRun_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RepairRun"
  ADD CONSTRAINT "RepairRun_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RepairActionRecord"
  ADD CONSTRAINT "RepairActionRecord_repairRunId_fkey"
  FOREIGN KEY ("repairRunId") REFERENCES "RepairRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RepairDiagnosticRecord"
  ADD CONSTRAINT "RepairDiagnosticRecord_repairRunId_fkey"
  FOREIGN KEY ("repairRunId") REFERENCES "RepairRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
