import { recordUsage } from "@platform/billing";

export async function meterGenerationJob(input: {
  organizationId: string;
  projectId: string;
}) {
  await recordUsage({
    organizationId: input.organizationId,
    projectId: input.projectId,
    metricKey: "generation_jobs",
    quantity: 1,
    unit: "count"
  });
}

export async function meterPreviewJob(input: {
  organizationId?: string;
  projectId: string;
}) {
  if (!input.organizationId) return;
  await recordUsage({
    organizationId: input.organizationId,
    projectId: input.projectId,
    metricKey: "preview_jobs",
    quantity: 1,
    unit: "count"
  });
}

export async function meterDeploymentJob(input: {
  organizationId?: string;
  projectId: string;
}) {
  if (!input.organizationId) return;
  await recordUsage({
    organizationId: input.organizationId,
    projectId: input.projectId,
    metricKey: "deployment_jobs",
    quantity: 1,
    unit: "count"
  });
}
