CREATE TABLE "PromptTemplate" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromptVersion" (
  "id" TEXT PRIMARY KEY,
  "promptTemplateId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "body" TEXT NOT NULL,
  "changelog" TEXT,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromptEvaluation" (
  "id" TEXT PRIMARY KEY,
  "promptVersionId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "summary" TEXT,
  "scoreJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromptRun" (
  "id" TEXT PRIMARY KEY,
  "promptVersionId" TEXT NOT NULL,
  "inputText" TEXT,
  "status" TEXT NOT NULL,
  "outputJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PromptVersion_template_createdAt_idx"
  ON "PromptVersion"("promptTemplateId", "createdAt");

CREATE INDEX "PromptEvaluation_version_createdAt_idx"
  ON "PromptEvaluation"("promptVersionId", "createdAt");

CREATE INDEX "PromptRun_version_createdAt_idx"
  ON "PromptRun"("promptVersionId", "createdAt");

ALTER TABLE "PromptTemplate"
  ADD CONSTRAINT "PromptTemplate_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PromptVersion"
  ADD CONSTRAINT "PromptVersion_promptTemplateId_fkey"
  FOREIGN KEY ("promptTemplateId") REFERENCES "PromptTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PromptVersion"
  ADD CONSTRAINT "PromptVersion_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PromptEvaluation"
  ADD CONSTRAINT "PromptEvaluation_promptVersionId_fkey"
  FOREIGN KEY ("promptVersionId") REFERENCES "PromptVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PromptRun"
  ADD CONSTRAINT "PromptRun_promptVersionId_fkey"
  FOREIGN KEY ("promptVersionId") REFERENCES "PromptVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
