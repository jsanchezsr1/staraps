import path from "path";
import { EcrRegistryProvider, LocalImageRegistryProvider } from "@platform/runtime";

export async function buildAndPushRuntimeImage(input: {
  projectId: string;
  versionId: string;
  generatedAppsRoot: string;
}) {
  const sourceDir = path.join(input.generatedAppsRoot, input.projectId, input.versionId, "app", "frontend");
  const imageTag = `${input.projectId}-${input.versionId}`.replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();

  const provider = process.env.ECR_REPOSITORY
    ? new EcrRegistryProvider({
        accountId: process.env.AWS_ACCOUNT_ID || "000000000000",
        region: process.env.S3_REGION || "us-east-1",
        repository: process.env.ECR_REPOSITORY
      })
    : new LocalImageRegistryProvider();

  const built = await provider.buildImage({ sourceDir, imageTag });
  return provider.pushImage({ imageTag: built.imageTag });
}
