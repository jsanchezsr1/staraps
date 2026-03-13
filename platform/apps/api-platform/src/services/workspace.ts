import { projectVersionsRepository, projectsRepository, generationJobsRepository, platformJobsRepository } from "@platform/database";

export async function getProjectWorkspace(projectId: string) {
  const project = await projectsRepository.findById(projectId);
  const versions = await projectVersionsRepository.listByProject(projectId);
  const latestVersionId = project?.latestVersionId || versions[0]?.id;
  const latestVersion = latestVersionId ? await projectVersionsRepository.findById(latestVersionId) : null;
  const generationJobs = await generationJobsRepository.listByProject(projectId);
  const platformJobs = await platformJobsRepository.listByProject(projectId);

  return {
    project,
    latestVersion,
    versions,
    generationJobs,
    platformJobs
  };
}
