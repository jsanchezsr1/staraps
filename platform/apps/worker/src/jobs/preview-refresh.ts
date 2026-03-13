import { previewEnvironmentsRepository } from "@platform/database";

export async function refreshPreview(input: {
  projectId: string;
  versionId: string;
  target?: string;
}) {
  const previews = await previewEnvironmentsRepository.listByProject(input.projectId);
  const active = previews.find((preview) => preview.status === "RUNNING");

  return {
    ok: true,
    refreshed: Boolean(active),
    projectId: input.projectId,
    versionId: input.versionId,
    target: input.target || "local-docker"
  };
}
