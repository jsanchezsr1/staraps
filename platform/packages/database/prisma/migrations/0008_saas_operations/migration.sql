CREATE TABLE "PlanDefinition" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "monthlyPriceCents" INTEGER NOT NULL DEFAULT 0,
  "limitsJson" JSONB NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrganizationSubscription" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL UNIQUE,
  "planDefinitionId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "billingProvider" TEXT,
  "providerCustomerId" TEXT,
  "providerSubscriptionId" TEXT,
  "currentPeriodStart" TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP,
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UsageRecord" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "projectId" TEXT,
  "metricKey" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "periodStart" TIMESTAMP NOT NULL,
  "periodEnd" TIMESTAMP NOT NULL,
  "metadataJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "UsageRecord_org_metric_period_idx"
  ON "UsageRecord"("organizationId", "metricKey", "periodStart");

ALTER TABLE "OrganizationSubscription"
  ADD CONSTRAINT "OrganizationSubscription_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrganizationSubscription"
  ADD CONSTRAINT "OrganizationSubscription_planDefinitionId_fkey"
  FOREIGN KEY ("planDefinitionId") REFERENCES "PlanDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UsageRecord"
  ADD CONSTRAINT "UsageRecord_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UsageRecord"
  ADD CONSTRAINT "UsageRecord_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
