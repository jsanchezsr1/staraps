CREATE TABLE "TemplateDefinition" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "templateSpecJson" JSONB NOT NULL,
  "tagsJson" JSONB,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TemplateInstallation" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "templateDefinitionId" TEXT NOT NULL,
  "installedByUserId" TEXT,
  "projectId" TEXT,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "TemplateDefinition_category_isPublished_idx"
  ON "TemplateDefinition"("category", "isPublished");

CREATE INDEX "TemplateInstallation_organizationId_createdAt_idx"
  ON "TemplateInstallation"("organizationId", "createdAt");

ALTER TABLE "TemplateInstallation"
  ADD CONSTRAINT "TemplateInstallation_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TemplateInstallation"
  ADD CONSTRAINT "TemplateInstallation_templateDefinitionId_fkey"
  FOREIGN KEY ("templateDefinitionId") REFERENCES "TemplateDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TemplateInstallation"
  ADD CONSTRAINT "TemplateInstallation_installedByUserId_fkey"
  FOREIGN KEY ("installedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TemplateInstallation"
  ADD CONSTRAINT "TemplateInstallation_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
