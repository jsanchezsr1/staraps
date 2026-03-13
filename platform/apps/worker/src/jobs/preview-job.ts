import { platformJobsRepository } from "@platform/database";

export async function runPreviewJob(input: {
  platformJobId: string;
}) {
  await platformJobsRepository.update(input.platformJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    log: "Preparing preview environment"
  });

  await platformJobsRepository.update(input.platformJobId, {
    status: "COMPLETED",
    finishedAt: new Date(),
    previewUrl: "http://preview.localhost/example",
    log: "Preview ready"
  });

  return { ok: true };
}
