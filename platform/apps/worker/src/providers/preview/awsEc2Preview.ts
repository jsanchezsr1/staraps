import { platformJobsRepository, previewEnvironmentsRepository } from "@platform/database";
import { randomUUID } from "crypto";

export async function runAwsEc2Preview(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Preparing AWS EC2 preview runtime scaffold"
  });

  const env = await previewEnvironmentsRepository.create({
    id: randomUUID(),
    platformJobId: input.platformJobId,
    projectId: input.projectId,
    projectVersionId: input.versionId || null,
    runtimeType: "aws-ec2",
    status: "RUNNING",
    host: "preview.example.aws",
    port: 443,
    previewUrl: `https://preview-${input.projectId}.example.aws`,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    previewUrl: env.previewUrl,
    log: "AWS EC2 preview scaffold completed"
  });

  return { ok: true, previewUrl: env.previewUrl };
}
