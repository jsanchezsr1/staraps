import type { PreviewRoutingRecord, RuntimeDeploymentTarget } from "./types";

export type PreviewStartResult = {
  provider: string;
  previewUrl: string;
  routing: PreviewRoutingRecord;
  providerMetadata?: Record<string, unknown>;
};

export class AwsEcsPreviewProvider {
  async startPreview(input: {
    previewEnvironmentId: string;
    projectId: string;
    versionId?: string;
    imageUri: string;
    target: RuntimeDeploymentTarget;
  }): Promise<PreviewStartResult> {
    const host = `preview-${input.projectId}.ecs.example.internal`;
    return {
      provider: "aws-ecs",
      previewUrl: `https://preview-${input.projectId}.platform.dev`,
      routing: {
        previewEnvironmentId: input.previewEnvironmentId,
        hostname: `preview-${input.projectId}.platform.dev`,
        targetHost: host,
        targetPort: 3000,
        provider: "aws-ecs"
      },
      providerMetadata: {
        cluster: input.target.cluster || "default",
        imageUri: input.imageUri
      }
    };
  }
}

export class KubernetesPreviewProvider {
  async startPreview(input: {
    previewEnvironmentId: string;
    projectId: string;
    versionId?: string;
    imageUri: string;
    target: RuntimeDeploymentTarget;
  }): Promise<PreviewStartResult> {
    const host = `${input.projectId}.preview.svc.cluster.local`;
    return {
      provider: "kubernetes",
      previewUrl: `https://preview-${input.projectId}.platform.dev`,
      routing: {
        previewEnvironmentId: input.previewEnvironmentId,
        hostname: `preview-${input.projectId}.platform.dev`,
        targetHost: host,
        targetPort: 3000,
        provider: "kubernetes"
      },
      providerMetadata: {
        namespace: input.target.namespace || "platform-preview",
        imageUri: input.imageUri
      }
    };
  }
}
