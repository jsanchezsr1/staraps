CREATE TABLE "PortfolioCompany" (
  "id" TEXT PRIMARY KEY,
  "venturePortfolioEntryId" TEXT,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "summary" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PortfolioKpiSnapshot" (
  "id" TEXT PRIMARY KEY,
  "portfolioCompanyId" TEXT NOT NULL,
  "metric" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "period" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PortfolioInterventionRecord" (
  "id" TEXT PRIMARY KEY,
  "portfolioCompanyId" TEXT NOT NULL,
  "interventionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "expectedImpact" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PortfolioCompany_status_createdAt_idx"
  ON "PortfolioCompany"("status", "createdAt");

CREATE INDEX "PortfolioKpiSnapshot_company_createdAt_idx"
  ON "PortfolioKpiSnapshot"("portfolioCompanyId", "createdAt");

CREATE INDEX "PortfolioInterventionRecord_company_createdAt_idx"
  ON "PortfolioInterventionRecord"("portfolioCompanyId", "createdAt");

ALTER TABLE "PortfolioCompany"
  ADD CONSTRAINT "PortfolioCompany_venturePortfolioEntryId_fkey"
  FOREIGN KEY ("venturePortfolioEntryId") REFERENCES "VenturePortfolioEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PortfolioKpiSnapshot"
  ADD CONSTRAINT "PortfolioKpiSnapshot_portfolioCompanyId_fkey"
  FOREIGN KEY ("portfolioCompanyId") REFERENCES "PortfolioCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PortfolioInterventionRecord"
  ADD CONSTRAINT "PortfolioInterventionRecord_portfolioCompanyId_fkey"
  FOREIGN KEY ("portfolioCompanyId") REFERENCES "PortfolioCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
