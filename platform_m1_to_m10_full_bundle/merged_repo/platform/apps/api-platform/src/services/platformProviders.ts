export type PreviewProvider = {
  key: "local-docker" | "aws-ec2";
  name: string;
  description: string;
};

export type DeploymentProvider = {
  key: "local-docker" | "aws-ec2" | "vercel" | "railway";
  name: string;
  description: string;
};

export const previewProviders: PreviewProvider[] = [
  {
    key: "local-docker",
    name: "Local Docker Preview",
    description: "Runs a generated app preview using local Docker-compatible infrastructure"
  },
  {
    key: "aws-ec2",
    name: "AWS EC2 Preview",
    description: "Deploys preview build to an EC2-backed preview target scaffold"
  }
];

export const deploymentProviders: DeploymentProvider[] = [
  {
    key: "local-docker",
    name: "Local Docker Deployment",
    description: "Deploys generated app using Docker compose"
  },
  {
    key: "aws-ec2",
    name: "AWS EC2 Deployment",
    description: "Deploys generated app to EC2"
  },
  {
    key: "vercel",
    name: "Vercel Deployment",
    description: "Deploys frontend-oriented workloads to Vercel scaffold"
  },
  {
    key: "railway",
    name: "Railway Deployment",
    description: "Deploys container/service workloads to Railway scaffold"
  }
];
