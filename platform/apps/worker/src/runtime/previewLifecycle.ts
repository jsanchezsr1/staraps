import { randomUUID } from "crypto";
import path from "path";
import fs from "fs-extra";
import {
  previewEnvironmentsRepository,
  platformJobsRepository,
  generationJobsRepository,
  prisma
} from "@platform/database";
import { allocatePreviewPort } from "./portAllocator";
import { ensureArtifactCacheRoot, buildArtifactCacheKey, cacheArtifact } from "./artifactCache";
import {
  buildDockerBuildCommand,
  buildDockerImageTag,
  buildDockerRunCommand,
  buildPreviewContainerName,
  buildDockerStopCommand
} from "./dockerCommands";

export async function createPreviewEnvironment(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  generatedAppsRoot: string;
}) {
  const imageTag = buildDockerImageTag({ projectId: input.projectId, versionId: input.versionId });
  const containerName = buildPreviewContainerName({ projectId: input.projectId, versionId: input.versionId });
  const hostPort = allocatePreviewPort(`${input.projectId}:${input.versionId || "latest"}`);
  const cacheRoot = path.join(input.generatedAppsRoot, ".preview-cache");

  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Preparing preview environment"
  });

  const generationJob = await prisma.generationJob.findFirst({
    where: {
      projectId: input.projectId,
      projectVersionId: input.versionId || undefined,
      artifactPath: { not: null }
    },
    orderBy: { createdAt: "desc" }
  });

  const artifactPath = generationJob?.artifactPath || path.join(input.generatedAppsRoot, input.projectId, input.versionId || "latest", "generated-app.zip");
  const cacheKey = buildArtifactCacheKey({
    projectId: input.projectId,
    versionId: input.versionId,
    artifactPath
  });

  await ensureArtifactCacheRoot(cacheRoot);
  const cachedArtifactPath = await cacheArtifact({
    cacheRoot,
    artifactPath,
    cacheKey
  });

  const appDir = path.join(input.generatedAppsRoot, input.projectId, input.versionId || "latest", "app");
  await fs.ensureDir(appDir);

  const buildCommand = buildDockerBuildCommand({
    appDir,
    imageTag
  });

  const runCommand = buildDockerRunCommand({
    imageTag,
    containerName,
    hostPort
  });

  const env = await previewEnvironmentsRepository.create({
    id: randomUUID(),
    platformJobId: input.platformJobId,
    projectId: input.projectId,
    projectVersionId: input.versionId || null,
    runtimeType: "docker",
    status: "RUNNING",
    containerId: containerName,
    host: "localhost",
    port: hostPort,
    previewUrl: `http://localhost:${hostPort}`,
    artifactCacheKey: cacheKey,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    previewUrl: env.previewUrl,
    log: [
      "Preview build completed",
      `Cached artifact: ${cachedArtifactPath}`,
      `Docker build command: ${buildCommand.join(" ")}`,
      `Docker run command: ${runCommand.join(" ")}`
    ].join("\n")
  });

  return env;
}

export async function stopPreviewEnvironment(input: {
  previewEnvironmentId: string;
}) {
  const env = await prisma.previewEnvironment.findUnique({
    where: { id: input.previewEnvironmentId }
  });

  if (!env) {
    throw new Error("Preview environment not found");
  }

  const stopCommand = env.containerId ? buildDockerStopCommand(env.containerId) : null;

  const updated = await previewEnvironmentsRepository.update(env.id, {
    status: "STOPPED",
    stoppedAt: new Date()
  });

  await platformJobsRepository.update(env.platformJobId, {
    status: "COMPLETED",
    log: stopCommand ? `Preview stopped\nDocker stop command: ${stopCommand.join(" ")}` : "Preview stopped"
  });

  return updated;
}
