CREATE TABLE "MarketplaceTransaction" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT,
  "purchaseType" TEXT NOT NULL,
  "templateDefinitionId" TEXT,
  "pluginMarketplaceItemId" TEXT,
  "buyerUserId" TEXT,
  "amountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL,
  "provider" TEXT,
  "providerTransactionId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MarketplaceRevenueShare" (
  "id" TEXT PRIMARY KEY,
  "transactionId" TEXT NOT NULL UNIQUE,
  "developerId" TEXT,
  "grossCents" INTEGER NOT NULL,
  "developerNetCents" INTEGER NOT NULL,
  "platformFeeCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MarketplacePayout" (
  "id" TEXT PRIMARY KEY,
  "developerId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL,
  "provider" TEXT,
  "providerPayoutId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DeveloperBalance" (
  "id" TEXT PRIMARY KEY,
  "developerId" TEXT NOT NULL UNIQUE,
  "pendingCents" INTEGER NOT NULL DEFAULT 0,
  "paidCents" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "MarketplaceTransaction_org_createdAt_idx"
  ON "MarketplaceTransaction"("organizationId", "createdAt");

CREATE INDEX "MarketplacePayout_developer_createdAt_idx"
  ON "MarketplacePayout"("developerId", "createdAt");

ALTER TABLE "MarketplaceTransaction"
  ADD CONSTRAINT "MarketplaceTransaction_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketplaceTransaction"
  ADD CONSTRAINT "MarketplaceTransaction_templateDefinitionId_fkey"
  FOREIGN KEY ("templateDefinitionId") REFERENCES "TemplateDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketplaceTransaction"
  ADD CONSTRAINT "MarketplaceTransaction_pluginMarketplaceItemId_fkey"
  FOREIGN KEY ("pluginMarketplaceItemId") REFERENCES "PluginMarketplaceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketplaceTransaction"
  ADD CONSTRAINT "MarketplaceTransaction_buyerUserId_fkey"
  FOREIGN KEY ("buyerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketplaceRevenueShare"
  ADD CONSTRAINT "MarketplaceRevenueShare_transactionId_fkey"
  FOREIGN KEY ("transactionId") REFERENCES "MarketplaceTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MarketplaceRevenueShare"
  ADD CONSTRAINT "MarketplaceRevenueShare_developerId_fkey"
  FOREIGN KEY ("developerId") REFERENCES "PluginDeveloper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketplacePayout"
  ADD CONSTRAINT "MarketplacePayout_developerId_fkey"
  FOREIGN KEY ("developerId") REFERENCES "PluginDeveloper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeveloperBalance"
  ADD CONSTRAINT "DeveloperBalance_developerId_fkey"
  FOREIGN KEY ("developerId") REFERENCES "PluginDeveloper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
