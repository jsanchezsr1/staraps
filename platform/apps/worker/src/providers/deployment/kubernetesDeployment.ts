import { platformJobsRepository } from "@platform/database";
import { KubernetesDeploymentProvider } from "@platform/runtime";

export async function runKubernetesDeployment(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  imageUri: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Deploying with Kubernetes runtime"
  });

  const provider = new KubernetesDeploymentProvider();
  const result = await provider.startDeployment({
    projectId: input.projectId,
    versionId: input.versionId,
    imageUri: input.imageUri,
    target: { provider: "kubernetes", namespace: "platform-prod" }
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    deploymentUrl: result.deploymentUrl,
    log: "Kubernetes deployment ready"
  });

  return result;
}
