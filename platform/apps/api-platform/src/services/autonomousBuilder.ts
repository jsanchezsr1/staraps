import { randomUUID } from "crypto";
import { buildAutonomousPlan, executeAutonomousRun } from "@platform/autonomous-builder";
import {
  autonomousBuildRunsRepository,
  autonomousBuildStepsRepository
} from "@platform/database";

export async function createAutonomousBuildRun(input: {
  organizationId?: string;
  projectId?: string;
  requestedByUserId?: string;
  prompt: string;
}) {
  const plan = await buildAutonomousPlan({ prompt: input.prompt });

  const run = await autonomousBuildRunsRepository.create({
    id: randomUUID(),
    organizationId: input.organizationId || null,
    projectId: input.projectId || null,
    requestedByUserId: input.requestedByUserId || null,
    prompt: input.prompt,
    status: "queued",
    planJson: plan
  });

  for (const step of plan.steps) {
    await autonomousBuildStepsRepository.create({
      id: randomUUID(),
      autonomousBuildRunId: run.id,
      stepType: step.type,
      title: step.title,
      status: "queued",
      detailsJson: { description: step.description }
    });
  }

  return run;
}

export async function executeAutonomousBuildRun(runId: string) {
  const run = await autonomousBuildRunsRepository.findById(runId);
  if (!run) throw new Error("Autonomous build run not found");

  await autonomousBuildRunsRepository.update(runId, {
    status: "executing",
    startedAt: new Date()
  });

  const result = await executeAutonomousRun({
    runId,
    projectId: run.projectId || undefined,
    prompt: run.prompt
  });

  await autonomousBuildRunsRepository.update(runId, {
    status: result.status,
    resultJson: result,
    finishedAt: new Date()
  });

  return autonomousBuildRunsRepository.findById(runId);
}
