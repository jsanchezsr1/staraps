CREATE TABLE "AutonomousBuildRun" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT,
  "projectId" TEXT,
  "requestedByUserId" TEXT,
  "prompt" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "planJson" JSONB,
  "resultJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "AutonomousBuildStep" (
  "id" TEXT PRIMARY KEY,
  "autonomousBuildRunId" TEXT NOT NULL,
  "stepType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "detailsJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "AutonomousBuildRun_org_createdAt_idx"
  ON "AutonomousBuildRun"("organizationId", "createdAt");

CREATE INDEX "AutonomousBuildStep_run_createdAt_idx"
  ON "AutonomousBuildStep"("autonomousBuildRunId", "createdAt");

ALTER TABLE "AutonomousBuildRun"
  ADD CONSTRAINT "AutonomousBuildRun_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AutonomousBuildRun"
  ADD CONSTRAINT "AutonomousBuildRun_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AutonomousBuildRun"
  ADD CONSTRAINT "AutonomousBuildRun_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AutonomousBuildStep"
  ADD CONSTRAINT "AutonomousBuildStep_autonomousBuildRunId_fkey"
  FOREIGN KEY ("autonomousBuildRunId") REFERENCES "AutonomousBuildRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
