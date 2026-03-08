import { platformJobsRepository } from "@platform/database";

export async function runLocalDockerDeployment(input: {
  platformJobId: string;
  projectId: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Deploying using local Docker adapter"
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    deploymentUrl: `http://deployment.localhost/${input.projectId}`,
    log: "Local Docker deployment completed"
  });

  return { ok: true };
}
