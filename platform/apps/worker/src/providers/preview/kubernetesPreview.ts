import { randomUUID } from "crypto";
import { platformJobsRepository, previewEnvironmentsRepository, previewRoutingRepository } from "@platform/database";
import { KubernetesPreviewProvider } from "@platform/runtime";

export async function runKubernetesPreview(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  imageUri: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Preparing Kubernetes preview runtime"
  });

  const env = await previewEnvironmentsRepository.create({
    id: randomUUID(),
    platformJobId: input.platformJobId,
    projectId: input.projectId,
    projectVersionId: input.versionId || null,
    runtimeType: "kubernetes",
    status: "STARTING"
  });

  const provider = new KubernetesPreviewProvider();
  const result = await provider.startPreview({
    previewEnvironmentId: env.id,
    projectId: input.projectId,
    versionId: input.versionId,
    imageUri: input.imageUri,
    target: { provider: "kubernetes", namespace: "platform-preview" }
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
    log: "Kubernetes preview runtime ready"
  });

  return updated;
}
