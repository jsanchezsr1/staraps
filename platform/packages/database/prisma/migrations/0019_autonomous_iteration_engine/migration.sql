CREATE TABLE "IterationRun" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "requestedByUserId" TEXT,
  "status" TEXT NOT NULL,
  "contextJson" JSONB,
  "resultJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "IterationSuggestionRecord" (
  "id" TEXT PRIMARY KEY,
  "iterationRunId" TEXT NOT NULL,
  "suggestionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "IterationActionRecord" (
  "id" TEXT PRIMARY KEY,
  "iterationRunId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "IterationRun_project_createdAt_idx"
  ON "IterationRun"("projectId", "createdAt");

CREATE INDEX "IterationSuggestionRecord_run_createdAt_idx"
  ON "IterationSuggestionRecord"("iterationRunId", "createdAt");

CREATE INDEX "IterationActionRecord_run_createdAt_idx"
  ON "IterationActionRecord"("iterationRunId", "createdAt");

ALTER TABLE "IterationRun"
  ADD CONSTRAINT "IterationRun_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "IterationRun"
  ADD CONSTRAINT "IterationRun_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "IterationRun"
  ADD CONSTRAINT "IterationRun_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "IterationSuggestionRecord"
  ADD CONSTRAINT "IterationSuggestionRecord_iterationRunId_fkey"
  FOREIGN KEY ("iterationRunId") REFERENCES "IterationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "IterationActionRecord"
  ADD CONSTRAINT "IterationActionRecord_iterationRunId_fkey"
  FOREIGN KEY ("iterationRunId") REFERENCES "IterationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
