import type { PortfolioIntervention, PortfolioKpiSnapshot } from "./types";

export async function reviewPortfolioCompany(input: {
  companyName: string;
}) : Promise<{
  kpis: PortfolioKpiSnapshot[];
  interventions: PortfolioIntervention[];
}> {
  return {
    kpis: [
      { metric: "mrr", value: 4200, period: "current_month" },
      { metric: "active_users", value: 310, period: "current_month" },
      { metric: "conversion_rate", value: 0.062, period: "current_month" }
    ],
    interventions: [
      {
        type: "growth_campaign",
        title: "Expand acquisition channels",
        description: "Launch an additional growth campaign focused on high-intent traffic.",
        expectedImpact: "high"
      },
      {
        type: "pricing_adjustment",
        title: "Test a new pricing anchor",
        description: "Introduce a premium tier to improve monetization per account.",
        expectedImpact: "medium"
      }
    ]
  };
}
