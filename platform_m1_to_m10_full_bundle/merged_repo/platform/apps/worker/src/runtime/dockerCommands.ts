import path from "path";

export function buildDockerImageTag(input: {
  projectId: string;
  versionId?: string;
}) {
  const version = input.versionId || "latest";
  return `preview-${input.projectId}-${version}`.replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();
}

export function buildPreviewContainerName(input: {
  projectId: string;
  versionId?: string;
}) {
  const version = input.versionId || "latest";
  return `preview_${input.projectId}_${version}`.replace(/[^a-zA-Z0-9_.-]/g, "_").toLowerCase();
}

export function buildDockerComposeFilePath(baseDir: string) {
  return path.join(baseDir, "docker-compose.generated.yml");
}

export function buildDockerBuildCommand(input: {
  appDir: string;
  imageTag: string;
}) {
  return ["docker", "build", "-t", input.imageTag, input.appDir];
}

export function buildDockerRunCommand(input: {
  imageTag: string;
  containerName: string;
  hostPort: number;
  containerPort?: number;
}) {
  const port = input.containerPort || 3000;
  return [
    "docker",
    "run",
    "-d",
    "--name",
    input.containerName,
    "-p",
    `${input.hostPort}:${port}`,
    input.imageTag
  ];
}

export function buildDockerStopCommand(containerName: string) {
  return ["docker", "rm", "-f", containerName];
}
