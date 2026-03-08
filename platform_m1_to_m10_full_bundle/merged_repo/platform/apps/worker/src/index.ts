import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import fs from "fs-extra";
import path from "path";
import { parseEnv } from "@platform/shared/env";
import { structuredLogger, incrementCounter } from "@platform/shared";
import {
  generationJobsRepository,
  platformJobsRepository,
  prisma,
  GenerationJobStatus,
  projectVersionsRepository
} from "@platform/database";
import { generateApp } from "@platform/generator";
import { runPluginHook } from "@platform/plugins/runtime";
import { runPreviewProvider } from "./providers/preview";
import { runDeploymentProvider } from "./providers/deployment";
import { refreshPreview } from "./jobs/preview-refresh";
import { enqueueDeadLetter } from "./ops/deadLetterQueue";
import { storeGeneratedArtifact } from "./storage/artifactStorage";
import { buildAndPushRuntimeImage } from "./runtime/imageRegistry";
import { meterDeploymentJob, meterGenerationJob, meterPreviewJob } from "./ops/usageMetering";

type GenerationJobPayload = {
  organizationId: string;
  projectId: string;
  versionId: string;
  requestedByUserId: string;
  generationJobId: string;
};

type PlatformJobPayload = {
  platformJobId: string;
  projectId: string;
  versionId?: string;
  requestedByUserId?: string;
  organizationId?: string;
  type: "PREVIEW" | "DEPLOYMENT";
  target?: string;
};

type PreviewRefreshPayload = {
  projectId: string;
  versionId: string;
  target?: string;
};

const validatedEnv = parseEnv(process.env);

const connection = new IORedis(validatedEnv.REDIS_URL, {
  maxRetriesPerRequest: null
});

async function setProgress(generationJobId: string, progress: number, message: string, status?: GenerationJobStatus) {
  await generationJobsRepository.updateStatus(generationJobId, {
    status: status ?? GenerationJobStatus.RUNNING,
    log: `PROGRESS:${progress} ${message}`
  });
}

const generationWorker = new Worker<GenerationJobPayload>(
  "app-generation",
  async (job) => {
    structuredLogger.info("Processing generation job", { jobId: job.id, data: job.data }, "worker", "generation.start");
    incrementCounter("worker_jobs_started_total", { queue: "app-generation" });

    await generationJobsRepository.updateStatus(job.data.generationJobId, {
      status: GenerationJobStatus.RUNNING,
      startedAt: new Date(),
      log: "PROGRESS:10 Generation started"
    });

    await runPluginHook("beforeGenerate", {
      organizationId: job.data.organizationId,
      projectId: job.data.projectId,
      versionId: job.data.versionId
    });

    const version = await projectVersionsRepository.findById(job.data.versionId);
    if (!version) throw new Error("Project version not found");

    await setProgress(job.data.generationJobId, 25, "Loaded project version");

    const outputRoot = path.resolve(process.cwd(), "../../generated-apps");
    await fs.ensureDir(outputRoot);

    await setProgress(job.data.generationJobId, 50, "Preparing output directory");

    const result = await generateApp({
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      outputRoot,
      spec: version.appSpecJson as any
    });

    await setProgress(job.data.generationJobId, 80, "Generated app and archived artifact");

    const stat = await fs.stat(result.zipPath);
    const checksum = await sha256File(result.zipPath);

    const stored = await storeGeneratedArtifact({
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      artifactPath: result.zipPath
    });

    const artifact = await prisma.generatedArtifact.create({
      data: {
        generationJobId: job.data.generationJobId,
        fileName: path.basename(result.zipPath),
        filePath: stored.url || result.zipPath,
        size: BigInt(stat.size),
        checksum
      }
    });

    await meterGenerationJob({
      organizationId: job.data.organizationId,
      projectId: job.data.projectId
    });

    await runPluginHook("afterGenerate", {
      organizationId: job.data.organizationId,
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      metadata: { artifactId: artifact.id, storageKey: stored.key }
    });

    await generationJobsRepository.updateStatus(job.data.generationJobId, {
      status: GenerationJobStatus.COMPLETED,
      finishedAt: new Date(),
      artifactPath: artifact.filePath,
      log: `PROGRESS:100 Generation completed successfully. Files generated: ${result.fileCount}`
    });

    incrementCounter("worker_jobs_completed_total", { queue: "app-generation" });
    return { ok: true, artifactId: artifact.id };
  },
  { connection, concurrency: 2 }
);

const previewWorker = new Worker<PlatformJobPayload>(
  "platform-preview",
  async (job) => {
    incrementCounter("worker_jobs_started_total", { queue: "platform-preview" });
    await runPluginHook("beforePreview", {
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      target: job.data.target
    });

    const image = await buildAndPushRuntimeImage({
      projectId: job.data.projectId,
      versionId: job.data.versionId || "latest",
      generatedAppsRoot: path.resolve(process.cwd(), "../../generated-apps")
    });

    const result = await runPreviewProvider({
      provider: job.data.target || "local-docker",
      platformJobId: job.data.platformJobId,
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      imageUri: image.imageUri
    });

    await meterPreviewJob({
      organizationId: job.data.organizationId,
      projectId: job.data.projectId
    });

    await runPluginHook("afterPreview", {
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      target: job.data.target
    });

    incrementCounter("worker_jobs_completed_total", { queue: "platform-preview" });
    return result;
  },
  { connection, concurrency: 1 }
);

const deploymentWorker = new Worker<PlatformJobPayload>(
  "platform-deployment",
  async (job) => {
    incrementCounter("worker_jobs_started_total", { queue: "platform-deployment" });
    await runPluginHook("beforeDeploy", {
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      target: job.data.target
    });

    const image = await buildAndPushRuntimeImage({
      projectId: job.data.projectId,
      versionId: job.data.versionId || "latest",
      generatedAppsRoot: path.resolve(process.cwd(), "../../generated-apps")
    });

    const result = await runDeploymentProvider({
      provider: job.data.target || "local-docker",
      platformJobId: job.data.platformJobId,
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      imageUri: image.imageUri
    });

    await meterDeploymentJob({
      organizationId: job.data.organizationId,
      projectId: job.data.projectId
    });

    await runPluginHook("afterDeploy", {
      projectId: job.data.projectId,
      versionId: job.data.versionId,
      target: job.data.target
    });

    incrementCounter("worker_jobs_completed_total", { queue: "platform-deployment" });
    return result;
  },
  { connection, concurrency: 1 }
);

const previewRefreshWorker = new Worker<PreviewRefreshPayload>(
  "platform-preview-refresh",
  async (job) => {
    incrementCounter("worker_jobs_started_total", { queue: "platform-preview-refresh" });
    const result = await refreshPreview(job.data);
    incrementCounter("worker_jobs_completed_total", { queue: "platform-preview-refresh" });
    return result;
  },
  { connection, concurrency: 1 }
);

generationWorker.on("completed", (job) => structuredLogger.info("Generation job completed", { jobId: job?.id }, "worker", "generation.completed"));
generationWorker.on("failed", async (job, err) => {
  structuredLogger.error("Generation job failed", { jobId: job?.id, error: err.message }, "worker", "generation.failed");
  incrementCounter("worker_jobs_failed_total", { queue: "app-generation" });
  if (job?.data?.generationJobId) {
    await generationJobsRepository.updateStatus(job.data.generationJobId, {
      status: GenerationJobStatus.FAILED,
      finishedAt: new Date(),
      log: `PROGRESS:100 FAILED ${err.message}`
    });
  }
  await enqueueDeadLetter({
    sourceQueue: "app-generation",
    payload: job?.data,
    errorMessage: err.message
  });
});

previewWorker.on("failed", async (job, err) => {
  structuredLogger.error("Preview job failed", { jobId: job?.id, error: err.message }, "worker", "preview.failed");
  incrementCounter("worker_jobs_failed_total", { queue: "platform-preview" });
  if (job?.data?.platformJobId) {
    await platformJobsRepository.update(job.data.platformJobId, {
      status: "FAILED",
      finishedAt: new Date(),
      log: err.message
    });
  }
  await enqueueDeadLetter({
    sourceQueue: "platform-preview",
    payload: job?.data,
    errorMessage: err.message
  });
});

deploymentWorker.on("failed", async (job, err) => {
  structuredLogger.error("Deployment job failed", { jobId: job?.id, error: err.message }, "worker", "deployment.failed");
  incrementCounter("worker_jobs_failed_total", { queue: "platform-deployment" });
  if (job?.data?.platformJobId) {
    await platformJobsRepository.update(job.data.platformJobId, {
      status: "FAILED",
      finishedAt: new Date(),
      log: err.message
    });
  }
  await enqueueDeadLetter({
    sourceQueue: "platform-deployment",
    payload: job?.data,
    errorMessage: err.message
  });
});

previewRefreshWorker.on("failed", async (job, err) => {
  structuredLogger.error("Preview refresh failed", { jobId: job?.id, error: err.message }, "worker", "preview_refresh.failed");
  incrementCounter("worker_jobs_failed_total", { queue: "platform-preview-refresh" });
  await enqueueDeadLetter({
    sourceQueue: "platform-preview-refresh",
    payload: job?.data,
    errorMessage: err.message
  });
});

async function sha256File(filePath: string): Promise<string> {
  const crypto = await import("crypto");
  const buf = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

structuredLogger.info("Workers running.", { queues: ["app-generation", "platform-preview", "platform-deployment", "platform-preview-refresh"] }, "worker", "startup");
