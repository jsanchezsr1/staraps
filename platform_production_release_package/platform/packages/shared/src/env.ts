import { z } from "zod";

export const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  PORT: z.string().default("4000"),
  NEXT_PUBLIC_API_URL: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  COOKIE_DOMAIN: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  LOCAL_STORAGE_ROOT: z.string().optional()
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function parseEnv(raw: Record<string, string | undefined>): AppEnv {
  return EnvSchema.parse(raw);
}
