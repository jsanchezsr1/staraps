import { platformJobsRepository } from "@platform/database";

export async function runAwsEc2Deployment(input: {
  platformJobId: string;
  projectId: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Deploying using AWS EC2 adapter scaffold"
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    deploymentUrl: `https://${input.projectId}.example.aws`,
    log: "AWS EC2 deployment scaffold completed"
  });

  return { ok: true };
}
