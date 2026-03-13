import path from "path";
import { makeStorageProvider } from "@platform/storage";

export async function storeGeneratedArtifact(input: {
  projectId: string;
  versionId: string;
  artifactPath: string;
}) {
  const provider = makeStorageProvider();
  const ext = path.extname(input.artifactPath) || ".zip";
  const key = `artifacts/${input.projectId}/${input.versionId}/generated-app${ext}`;
  return provider.putFile({
    key,
    filePath: input.artifactPath,
    contentType: "application/zip"
  });
}
