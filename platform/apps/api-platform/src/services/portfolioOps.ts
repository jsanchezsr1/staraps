import { randomUUID } from "crypto";
import { reviewPortfolioCompany } from "@platform/portfolio-ops";
import {
  portfolioCompaniesRepository,
  portfolioInterventionsRepository,
  portfolioKpiSnapshotsRepository
} from "@platform/database";

export async function createPortfolioCompany(input: {
  venturePortfolioEntryId?: string;
  name: string;
  status: string;
  summary?: string;
}) {
  return portfolioCompaniesRepository.create({
    id: randomUUID(),
    venturePortfolioEntryId: input.venturePortfolioEntryId || null,
    name: input.name,
    status: input.status,
    summary: input.summary || null
  });
}

export async function reviewCompany(input: { portfolioCompanyId: string }) {
  const company = await portfolioCompaniesRepository.findById(input.portfolioCompanyId);
  if (!company) throw new Error("Portfolio company not found");

  const review = await reviewPortfolioCompany({ companyName: company.name });

  for (const kpi of review.kpis) {
    await portfolioKpiSnapshotsRepository.create({
      id: randomUUID(),
      portfolioCompanyId: company.id,
      metric: kpi.metric,
      value: kpi.value,
      period: kpi.period
    });
  }

  for (const intervention of review.interventions) {
    await portfolioInterventionsRepository.create({
      id: randomUUID(),
      portfolioCompanyId: company.id,
      interventionType: intervention.type,
      title: intervention.title,
      description: intervention.description,
      expectedImpact: intervention.expectedImpact,
      payloadJson: intervention.payloadJson || null
    });
  }

  return portfolioCompaniesRepository.findById(company.id);
}
