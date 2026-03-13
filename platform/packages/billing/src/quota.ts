import {
  organizationSubscriptionsRepository,
  planDefinitionsRepository,
  projectsRepository,
  previewEnvironmentsRepository,
  platformJobsRepository,
  generationJobsRepository
} from "@platform/database";

export async function getOrganizationLimits(organizationId: string) {
  const subscription = await organizationSubscriptionsRepository.findByOrganizationId(organizationId);
  if (subscription?.planDefinition) {
    return subscription.planDefinition.limitsJson as any;
  }

  const freePlan = await planDefinitionsRepository.findByKey("free");
  return (freePlan?.limitsJson || {
    maxProjects: 3,
    maxPreviewEnvironments: 1,
    maxDeploymentsPerMonth: 2,
    maxGenerationJobsPerMonth: 20
  }) as any;
}

export async function assertProjectQuota(organizationId: string) {
  const limits = await getOrganizationLimits(organizationId);
  const projects = await projectsRepository.listByOrganization(organizationId);
  if (projects.length >= Number(limits.maxProjects || 0)) {
    throw new Error("Project quota exceeded");
  }
}

export async function assertPreviewQuota(organizationId: string) {
  const limits = await getOrganizationLimits(organizationId);
  const previews = await previewEnvironmentsRepository.listActive();
  const count = previews.filter((p: any) => p.project?.organizationId === organizationId).length;
  if (count >= Number(limits.maxPreviewEnvironments || 0)) {
    throw new Error("Preview quota exceeded");
  }
}

export async function assertDeploymentQuota(organizationId: string) {
  const limits = await getOrganizationLimits(organizationId);
  const jobs = await platformJobsRepository.listByOrganizationId?.(organizationId);
  const deployments = (jobs || []).filter((j: any) => j.type === "DEPLOYMENT");
  if (deployments.length >= Number(limits.maxDeploymentsPerMonth || 0)) {
    throw new Error("Deployment quota exceeded");
  }
}

export async function assertGenerationQuota(organizationId: string) {
  const limits = await getOrganizationLimits(organizationId);
  const jobs = await generationJobsRepository.listByOrganizationId?.(organizationId);
  if ((jobs || []).length >= Number(limits.maxGenerationJobsPerMonth || 0)) {
    throw new Error("Generation quota exceeded");
  }
}
