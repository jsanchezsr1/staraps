import { platformJobsRepository } from "@platform/database";
import { AwsEcsDeploymentProvider } from "@platform/runtime";

export async function runAwsEcsDeployment(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  imageUri: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Deploying with AWS ECS runtime"
  });

  const provider = new AwsEcsDeploymentProvider();
  const result = await provider.startDeployment({
    projectId: input.projectId,
    versionId: input.versionId,
    imageUri: input.imageUri,
    target: { provider: "aws-ecs", cluster: "platform-prod", region: process.env.S3_REGION || "us-east-1" }
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    deploymentUrl: result.deploymentUrl,
    log: "AWS ECS deployment ready"
  });

  return result;
}
