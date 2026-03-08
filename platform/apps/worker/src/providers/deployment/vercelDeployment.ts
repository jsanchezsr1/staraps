import { platformJobsRepository } from "@platform/database";

export async function runVercelDeployment(input: {
  platformJobId: string;
  projectId: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Deploying using Vercel adapter scaffold"
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    deploymentUrl: `https://${input.projectId}.vercel.app`,
    log: "Vercel deployment scaffold completed"
  });

  return { ok: true };
}
