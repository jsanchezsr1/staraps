import { z } from "zod";

export const runtimeScalePreviewSchema = z.object({
  provider: z.enum(["local-docker", "aws-ecs", "aws-ec2", "kubernetes"]).default("aws-ecs"),
  cluster: z.string().optional(),
  namespace: z.string().optional(),
  region: z.string().optional()
});

export const runtimeScaleDeploySchema = z.object({
  provider: z.enum(["local-docker", "aws-ecs", "aws-ec2", "kubernetes", "vercel", "railway"]).default("aws-ecs"),
  cluster: z.string().optional(),
  namespace: z.string().optional(),
  region: z.string().optional()
});
