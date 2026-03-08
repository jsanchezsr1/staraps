import { z } from "zod";

export const configureProviderSchema = z.object({
  provider: z.enum(["local-docker", "aws-ec2", "vercel", "railway"]),
  enabled: z.boolean().default(true),
  configJson: z.record(z.any()).optional().default({})
});
