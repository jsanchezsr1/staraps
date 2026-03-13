import "dotenv/config";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@platform/shared";

export type PlatformJobPayload = {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  requestedByUserId?: string;
  type: "PREVIEW" | "DEPLOYMENT";
  target?: string;
};

export type PreviewRefreshPayload = {
  projectId: string;
  versionId: string;
  target?: string;
};

const connection = new IORedis(env("REDIS_URL", "redis://localhost:6379"), {
  maxRetriesPerRequest: null
});

export const previewQueue = new Queue<PlatformJobPayload>("platform-preview", { connection });
export const deploymentQueue = new Queue<PlatformJobPayload>("platform-deployment", { connection });
export const previewRefreshQueue = new Queue<PreviewRefreshPayload>("platform-preview-refresh", { connection });

export async function enqueuePreviewJob(payload: PlatformJobPayload) {
  await previewQueue.add("preview-build", payload, {
    attempts: 2,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 50,
    removeOnFail: 50
  });
}

export async function enqueueDeploymentJob(payload: PlatformJobPayload) {
  await deploymentQueue.add("deployment-run", payload, {
    attempts: 2,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 50,
    removeOnFail: 50
  });
}

export async function enqueuePreviewRefresh(payload: PreviewRefreshPayload) {
  await previewRefreshQueue.add("preview-refresh", payload, {
    attempts: 2,
    backoff: { type: "exponential", delay: 500 },
    removeOnComplete: 50,
    removeOnFail: 50
  });
}
