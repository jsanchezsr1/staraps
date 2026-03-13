export type ImagePushResult = {
  imageUri: string;
  digest?: string;
};

export type ImageRegistryProvider = {
  buildImage(input: { sourceDir: string; imageTag: string }): Promise<{ imageTag: string }>;
  pushImage(input: { imageTag: string }): Promise<ImagePushResult>;
};

export class LocalImageRegistryProvider implements ImageRegistryProvider {
  async buildImage(input: { sourceDir: string; imageTag: string }) {
    return { imageTag: input.imageTag };
  }

  async pushImage(input: { imageTag: string }): Promise<ImagePushResult> {
    return {
      imageUri: `local/${input.imageTag}`,
      digest: "sha256:local-stub"
    };
  }
}

export class EcrRegistryProvider implements ImageRegistryProvider {
  constructor(private config: { accountId: string; region: string; repository: string }) {}

  async buildImage(input: { sourceDir: string; imageTag: string }) {
    return { imageTag: input.imageTag };
  }

  async pushImage(input: { imageTag: string }): Promise<ImagePushResult> {
    return {
      imageUri: `${this.config.accountId}.dkr.ecr.${this.config.region}.amazonaws.com/${this.config.repository}:${input.imageTag}`,
      digest: "sha256:ecr-stub"
    };
  }
}
