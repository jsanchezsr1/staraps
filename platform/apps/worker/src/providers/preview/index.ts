import { runAwsEc2Preview } from "./awsEc2Preview";
import { runLocalDockerPreview } from "./localDockerPreview";
import { runAwsEcsPreview } from "./awsEcsPreview";
import { runKubernetesPreview } from "./kubernetesPreview";

export async function runPreviewProvider(input: {
  provider: string;
  platformJobId: string;
  projectId: string;
  versionId?: string;
  imageUri?: string;
}) {
  switch (input.provider) {
    case "aws-ecs":
      return runAwsEcsPreview({
        platformJobId: input.platformJobId,
        projectId: input.projectId,
        versionId: input.versionId,
        imageUri: input.imageUri || "local/missing-image"
      });
    case "kubernetes":
      return runKubernetesPreview({
        platformJobId: input.platformJobId,
        projectId: input.projectId,
        versionId: input.versionId,
        imageUri: input.imageUri || "local/missing-image"
      });
    case "aws-ec2":
      return runAwsEc2Preview(input);
    case "local-docker":
    default:
      return runLocalDockerPreview(input);
  }
}
