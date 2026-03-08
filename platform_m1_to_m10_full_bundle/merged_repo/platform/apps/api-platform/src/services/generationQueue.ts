import "dotenv/config";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@platform/shared";

export type GenerationJobPayload = {
  organizationId: string;
  projectId: string;
  versionId: string;
  requestedByUserId: string;
  generationJobId: string;
};

const connection = new IORedis(env("REDIS_URL", "redis://localhost:6379"), {
  maxRetriesPerRequest: null
});

const generationQueue = new Queue<GenerationJobPayload>("app-generation", {
  connection
});

export async function enqueueGenerationJob(payload: GenerationJobPayload): Promise<void> {
  await generationQueue.add("generate-app", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 50,
    removeOnFail: 50
  });
}
