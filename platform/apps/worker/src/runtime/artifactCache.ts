import crypto from "crypto";
import fs from "fs-extra";
import path from "path";

export async function ensureArtifactCacheRoot(rootDir: string) {
  await fs.ensureDir(rootDir);
}

export function buildArtifactCacheKey(input: {
  projectId: string;
  versionId?: string;
  artifactPath: string;
}) {
  const hash = crypto.createHash("sha256").update(`${input.projectId}:${input.versionId || "latest"}:${input.artifactPath}`).digest("hex");
  return `${input.projectId}/${input.versionId || "latest"}/${hash}`;
}

export async function cacheArtifact(input: {
  cacheRoot: string;
  artifactPath: string;
  cacheKey: string;
}) {
  const target = path.join(input.cacheRoot, input.cacheKey.replace(/:/g, "_"), path.basename(input.artifactPath));
  await fs.ensureDir(path.dirname(target));
  await fs.copy(input.artifactPath, target);
  return target;
}
