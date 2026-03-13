CREATE TABLE "VisualBuilderCanvas" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL UNIQUE,
  "projectVersionId" TEXT,
  "stateJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VisualBuilderPatchEvent" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "nodeId" TEXT NOT NULL,
  "operation" TEXT NOT NULL,
  "patchJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "VisualBuilderPatchEvent_project_createdAt_idx"
  ON "VisualBuilderPatchEvent"("projectId", "createdAt");

ALTER TABLE "VisualBuilderCanvas"
  ADD CONSTRAINT "VisualBuilderCanvas_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VisualBuilderCanvas"
  ADD CONSTRAINT "VisualBuilderCanvas_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VisualBuilderPatchEvent"
  ADD CONSTRAINT "VisualBuilderPatchEvent_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VisualBuilderPatchEvent"
  ADD CONSTRAINT "VisualBuilderPatchEvent_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VisualBuilderPatchEvent"
  ADD CONSTRAINT "VisualBuilderPatchEvent_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
