export type RuntimeProviderKey =
  | "local-docker"
  | "aws-ecs"
  | "aws-ec2"
  | "kubernetes";

export type RuntimeDeploymentTarget = {
  provider: RuntimeProviderKey;
  region?: string;
  cluster?: string;
  namespace?: string;
};

export type PreviewRoutingRecord = {
  previewEnvironmentId: string;
  hostname: string;
  pathPrefix?: string;
  targetHost: string;
  targetPort: number;
  provider: RuntimeProviderKey;
};
