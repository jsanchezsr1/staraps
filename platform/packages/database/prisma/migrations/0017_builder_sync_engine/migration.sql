CREATE TABLE "BuilderSyncRun" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "requestedByUserId" TEXT,
  "status" TEXT NOT NULL,
  "sourceMode" TEXT NOT NULL,
  "diffJson" JSONB,
  "conflictsJson" JSONB,
  "resultJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "BuilderRegenerationTrigger" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "triggerType" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "BuilderSyncRun_project_createdAt_idx"
  ON "BuilderSyncRun"("projectId", "createdAt");

CREATE INDEX "BuilderRegenerationTrigger_project_createdAt_idx"
  ON "BuilderRegenerationTrigger"("projectId", "createdAt");

ALTER TABLE "BuilderSyncRun"
  ADD CONSTRAINT "BuilderSyncRun_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BuilderSyncRun"
  ADD CONSTRAINT "BuilderSyncRun_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "BuilderSyncRun"
  ADD CONSTRAINT "BuilderSyncRun_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "BuilderRegenerationTrigger"
  ADD CONSTRAINT "BuilderRegenerationTrigger_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BuilderRegenerationTrigger"
  ADD CONSTRAINT "BuilderRegenerationTrigger_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "BuilderRegenerationTrigger"
  ADD CONSTRAINT "BuilderRegenerationTrigger_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
