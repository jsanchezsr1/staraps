import { makeDiagnostic } from "@platform/diagnostics";
import { generationJobsRepository, platformJobsRepository, previewRoutingRepository, previewEnvironmentsRepository } from "@platform/database";

export async function getProjectDiagnostics(projectId: string) {
  const generationJobs = await generationJobsRepository.listByProject(projectId);
  const platformJobs = await platformJobsRepository.listByProject(projectId);

  const entries = [
    ...generationJobs.slice(0, 10).map((job: any) =>
      makeDiagnostic({
        level: job.status === "FAILED" ? "error" : "info",
        source: "worker",
        message: job.log || `Generation job ${job.status}`,
        filePath: job.artifactPath || undefined
      })
    ),
    ...platformJobs.slice(0, 10).map((job: any) =>
      makeDiagnostic({
        level: job.status === "FAILED" ? "error" : "info",
        source: "worker",
        message: job.log || `Platform job ${job.status}`
      })
    )
  ];

  return entries;
}

export async function getRuntimeDashboard() {
  const routing = await previewRoutingRepository.listAll();
  const previews = await previewEnvironmentsRepository.listActive();
  return {
    activePreviews: previews,
    routing
  };
}
