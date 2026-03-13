CREATE TABLE "TemplateMarketplaceVersion" (
  "id" TEXT PRIMARY KEY,
  "templateDefinitionId" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "changelog" TEXT,
  "templateSpecJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TemplateRating" (
  "id" TEXT PRIMARY KEY,
  "templateDefinitionId" TEXT NOT NULL,
  "organizationId" TEXT,
  "userId" TEXT,
  "rating" INTEGER NOT NULL,
  "review" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "TemplateMarketplaceVersion_templateDefinitionId_createdAt_idx"
  ON "TemplateMarketplaceVersion"("templateDefinitionId", "createdAt");

CREATE INDEX "TemplateRating_templateDefinitionId_createdAt_idx"
  ON "TemplateRating"("templateDefinitionId", "createdAt");

ALTER TABLE "TemplateMarketplaceVersion"
  ADD CONSTRAINT "TemplateMarketplaceVersion_templateDefinitionId_fkey"
  FOREIGN KEY ("templateDefinitionId") REFERENCES "TemplateDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TemplateRating"
  ADD CONSTRAINT "TemplateRating_templateDefinitionId_fkey"
  FOREIGN KEY ("templateDefinitionId") REFERENCES "TemplateDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TemplateRating"
  ADD CONSTRAINT "TemplateRating_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TemplateRating"
  ADD CONSTRAINT "TemplateRating_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
