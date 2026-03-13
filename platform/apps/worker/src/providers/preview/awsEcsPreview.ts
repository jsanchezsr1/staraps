import { randomUUID } from "crypto";
import { platformJobsRepository, previewEnvironmentsRepository, previewRoutingRepository } from "@platform/database";
import { AwsEcsPreviewProvider } from "@platform/runtime";

export async function runAwsEcsPreview(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  imageUri: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Preparing AWS ECS preview runtime"
  });

  const env = await previewEnvironmentsRepository.create({
    id: randomUUID(),
    platformJobId: input.platformJobId,
    projectId: input.projectId,
    projectVersionId: input.versionId || null,
    runtimeType: "aws-ecs",
    status: "STARTING"
  });

  const provider = new AwsEcsPreviewProvider();
  const result = await provider.startPreview({
    previewEnvironmentId: env.id,
    projectId: input.projectId,
    versionId: input.versionId,
    imageUri: input.imageUri,
    target: { provider: "aws-ecs", cluster: "platform-preview", region: process.env.S3_REGION || "us-east-1" }
  });

  await previewRoutingRepository.upsert({
    id: randomUUID(),
    previewEnvironmentId: env.id,
    hostname: result.routing.hostname,
    pathPrefix: result.routing.pathPrefix || null,
    targetHost: result.routing.targetHost,
    targetPort: result.routing.targetPort,
    provider: result.routing.provider
  });

  const updated = await previewEnvironmentsRepository.update(env.id, {
    status: "RUNNING",
    host: result.routing.targetHost,
    port: result.routing.targetPort,
    previewUrl: result.previewUrl,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    previewUrl: result.previewUrl,
    log: "AWS ECS preview runtime ready"
  });

  return updated;
}
