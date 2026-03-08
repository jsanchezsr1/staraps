export type PlanLimits = {
  maxProjects: number;
  maxPreviewEnvironments: number;
  maxDeploymentsPerMonth: number;
  maxGenerationJobsPerMonth: number;
};

export const builtInPlans = [
  {
    key: "free",
    name: "Free",
    monthlyPriceCents: 0,
    limits: {
      maxProjects: 3,
      maxPreviewEnvironments: 1,
      maxDeploymentsPerMonth: 2,
      maxGenerationJobsPerMonth: 20
    } satisfies PlanLimits
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPriceCents: 4900,
    limits: {
      maxProjects: 25,
      maxPreviewEnvironments: 5,
      maxDeploymentsPerMonth: 50,
      maxGenerationJobsPerMonth: 500
    } satisfies PlanLimits
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthlyPriceCents: 19900,
    limits: {
      maxProjects: 1000,
      maxPreviewEnvironments: 100,
      maxDeploymentsPerMonth: 1000,
      maxGenerationJobsPerMonth: 10000
    } satisfies PlanLimits
  }
];
