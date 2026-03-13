CREATE TABLE "VentureBuildRun" (
  "id" TEXT PRIMARY KEY,
  "ventureIdeaId" TEXT,
  "status" TEXT NOT NULL,
  "planJson" JSONB,
  "appSpecJson" JSONB,
  "launchHandoffJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "VentureGeneratedProject" (
  "id" TEXT PRIMARY KEY,
  "ventureBuildRunId" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "projectSlug" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "generatorJobRef" TEXT,
  "deploymentRef" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "VentureBuildRun_createdAt_idx"
  ON "VentureBuildRun"("createdAt");

CREATE INDEX "VentureGeneratedProject_createdAt_idx"
  ON "VentureGeneratedProject"("createdAt");

ALTER TABLE "VentureBuildRun"
  ADD CONSTRAINT "VentureBuildRun_ventureIdeaId_fkey"
  FOREIGN KEY ("ventureIdeaId") REFERENCES "VentureIdea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VentureBuildRun"
  ADD CONSTRAINT "VentureBuildRun_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VentureGeneratedProject"
  ADD CONSTRAINT "VentureGeneratedProject_ventureBuildRunId_fkey"
  FOREIGN KEY ("ventureBuildRunId") REFERENCES "VentureBuildRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
