import type { RuntimeDeploymentTarget } from "./types";

export type DeploymentStartResult = {
  provider: string;
  deploymentUrl: string;
  providerMetadata?: Record<string, unknown>;
};

export class AwsEcsDeploymentProvider {
  async startDeployment(input: {
    projectId: string;
    versionId?: string;
    imageUri: string;
    target: RuntimeDeploymentTarget;
  }): Promise<DeploymentStartResult> {
    return {
      provider: "aws-ecs",
      deploymentUrl: `https://${input.projectId}.platform.app`,
      providerMetadata: {
        cluster: input.target.cluster || "platform-prod",
        imageUri: input.imageUri
      }
    };
  }
}

export class KubernetesDeploymentProvider {
  async startDeployment(input: {
    projectId: string;
    versionId?: string;
    imageUri: string;
    target: RuntimeDeploymentTarget;
  }): Promise<DeploymentStartResult> {
    return {
      provider: "kubernetes",
      deploymentUrl: `https://${input.projectId}.platform.app`,
      providerMetadata: {
        namespace: input.target.namespace || "platform-prod",
        imageUri: input.imageUri
      }
    };
  }
}
