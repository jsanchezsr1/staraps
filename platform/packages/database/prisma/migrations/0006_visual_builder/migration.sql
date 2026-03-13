CREATE TABLE "BuilderState" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL UNIQUE,
  "projectVersionId" TEXT,
  "layoutJson" JSONB NOT NULL,
  "selectedNodeId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "BuilderState_projectVersionId_idx"
  ON "BuilderState"("projectVersionId");

ALTER TABLE "BuilderState"
  ADD CONSTRAINT "BuilderState_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BuilderState"
  ADD CONSTRAINT "BuilderState_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
