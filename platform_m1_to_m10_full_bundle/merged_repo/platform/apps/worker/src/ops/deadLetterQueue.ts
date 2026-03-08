import "dotenv/config";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@platform/shared";

const connection = new IORedis(env("REDIS_URL", "redis://localhost:6379"), {
  maxRetriesPerRequest: null
});

export const deadLetterQueue = new Queue("platform-dead-letter", { connection });

export async function enqueueDeadLetter(input: {
  sourceQueue: string;
  payload: unknown;
  errorMessage: string;
}) {
  await deadLetterQueue.add("dead-letter", input, {
    removeOnComplete: 100,
    removeOnFail: 100
  });
}
