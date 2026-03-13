import path from "path";
import { createPreviewEnvironment } from "../../runtime/previewLifecycle";

export async function runLocalDockerPreview(input: {
  platformJobId: string;
  projectId: string;
  versionId?: string;
}) {
  const generatedAppsRoot = path.resolve(process.cwd(), "../../generated-apps");

  const env = await createPreviewEnvironment({
    platformJobId: input.platformJobId,
    projectId: input.projectId,
    versionId: input.versionId,
    generatedAppsRoot
  });

  return {
    ok: true,
    previewUrl: env.previewUrl
  };
}
