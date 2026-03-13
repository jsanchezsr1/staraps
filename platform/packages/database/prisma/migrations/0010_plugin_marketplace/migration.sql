CREATE TABLE "PluginDeveloper" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "organizationId" TEXT,
  "displayName" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "bio" TEXT,
  "websiteUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PluginMarketplaceItem" (
  "id" TEXT PRIMARY KEY,
  "developerId" TEXT NOT NULL,
  "key" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "permissionsJson" JSONB NOT NULL,
  "manifestJson" JSONB NOT NULL,
  "thumbnailUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PluginMarketplaceVersion" (
  "id" TEXT PRIMARY KEY,
  "pluginMarketplaceItemId" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "changelog" TEXT,
  "packageUrl" TEXT,
  "manifestJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PluginMarketplaceRating" (
  "id" TEXT PRIMARY KEY,
  "pluginMarketplaceItemId" TEXT NOT NULL,
  "organizationId" TEXT,
  "userId" TEXT,
  "rating" INTEGER NOT NULL,
  "review" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PluginMarketplaceItem_category_isPublished_idx"
  ON "PluginMarketplaceItem"("category", "isPublished");

CREATE INDEX "PluginMarketplaceVersion_item_createdAt_idx"
  ON "PluginMarketplaceVersion"("pluginMarketplaceItemId", "createdAt");

CREATE INDEX "PluginMarketplaceRating_item_createdAt_idx"
  ON "PluginMarketplaceRating"("pluginMarketplaceItemId", "createdAt");

ALTER TABLE "PluginDeveloper"
  ADD CONSTRAINT "PluginDeveloper_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PluginDeveloper"
  ADD CONSTRAINT "PluginDeveloper_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PluginMarketplaceItem"
  ADD CONSTRAINT "PluginMarketplaceItem_developerId_fkey"
  FOREIGN KEY ("developerId") REFERENCES "PluginDeveloper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PluginMarketplaceVersion"
  ADD CONSTRAINT "PluginMarketplaceVersion_pluginMarketplaceItemId_fkey"
  FOREIGN KEY ("pluginMarketplaceItemId") REFERENCES "PluginMarketplaceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PluginMarketplaceRating"
  ADD CONSTRAINT "PluginMarketplaceRating_pluginMarketplaceItemId_fkey"
  FOREIGN KEY ("pluginMarketplaceItemId") REFERENCES "PluginMarketplaceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PluginMarketplaceRating"
  ADD CONSTRAINT "PluginMarketplaceRating_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PluginMarketplaceRating"
  ADD CONSTRAINT "PluginMarketplaceRating_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
