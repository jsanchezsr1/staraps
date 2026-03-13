CREATE TABLE "VentureCreationRun" (
  "id" TEXT PRIMARY KEY,
  "status" TEXT NOT NULL,
  "inputJson" JSONB,
  "summaryJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "VentureIdea" (
  "id" TEXT PRIMARY KEY,
  "ventureCreationRunId" TEXT,
  "name" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "thesisJson" JSONB,
  "conceptJson" JSONB,
  "scorecardJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VenturePortfolioEntry" (
  "id" TEXT PRIMARY KEY,
  "ventureIdeaId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "statusSummary" TEXT,
  "metricsJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "VentureCreationRun"
  ADD CONSTRAINT "VentureCreationRun_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VentureIdea"
  ADD CONSTRAINT "VentureIdea_ventureCreationRunId_fkey"
  FOREIGN KEY ("ventureCreationRunId") REFERENCES "VentureCreationRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VenturePortfolioEntry"
  ADD CONSTRAINT "VenturePortfolioEntry_ventureIdeaId_fkey"
  FOREIGN KEY ("ventureIdeaId") REFERENCES "VentureIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
