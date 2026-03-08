import { runAwsEc2Deployment } from "./awsEc2Deployment";
import { runLocalDockerDeployment } from "./localDockerDeployment";
import { runRailwayDeployment } from "./railwayDeployment";
import { runVercelDeployment } from "./vercelDeployment";
import { runAwsEcsDeployment } from "./awsEcsDeployment";
import { runKubernetesDeployment } from "./kubernetesDeployment";

export async function runDeploymentProvider(input: {
  provider: string;
  platformJobId: string;
  projectId: string;
  versionId?: string;
  imageUri?: string;
}) {
  switch (input.provider) {
    case "aws-ecs":
      return runAwsEcsDeployment({
        platformJobId: input.platformJobId,
        projectId: input.projectId,
        versionId: input.versionId,
        imageUri: input.imageUri || "local/missing-image"
      });
    case "kubernetes":
      return runKubernetesDeployment({
        platformJobId: input.platformJobId,
        projectId: input.projectId,
        versionId: input.versionId,
        imageUri: input.imageUri || "local/missing-image"
      });
    case "aws-ec2":
      return runAwsEc2Deployment(input);
    case "vercel":
      return runVercelDeployment(input);
    case "railway":
      return runRailwayDeployment(input);
    case "local-docker":
    default:
      return runLocalDockerDeployment(input);
  }
}
