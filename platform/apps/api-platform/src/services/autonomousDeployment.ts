import { randomUUID } from "crypto";
import {
  buildDeploymentPlan,
  executeDeploymentPlan,
  executeDeploymentRollback,
  planDeploymentOptimizations
} from "@platform/autonomous-deployment";
import {
  deploymentEnvironmentsRepository,
  deploymentOptimizationsRepository,
  deploymentPlansRepository,
  deploymentRunsRepository
} from "@platform/database";

export async function createDeploymentPlan(input: {
  projectId: string;
  projectVersionId?: string;
  environmentType: string;
  createdByUserId?: string;
}) {
  const plan = await buildDeploymentPlan({
    projectId: input.projectId,
    environment: input.environmentType
  });

  return deploymentPlansRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    environmentType: input.environmentType,
    planJson: plan,
    createdByUserId: input.createdByUserId || null
  });
}

export async function createDeploymentRun(input: {
  projectId: string;
  projectVersionId?: string;
  environmentType: string;
  requestedByUserId?: string;
}) {
  const env = await deploymentEnvironmentsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    environmentType: input.environmentType,
    name: `${input.environmentType}-${input.projectId}`,
    status: "provisioning",
    url: null,
    runtimeRegionId: null
  });

  const plan = await createDeploymentPlan({
    projectId: input.projectId,
    projectVersionId: input.projectVersionId,
    environmentType: input.environmentType,
    createdByUserId: input.requestedByUserId
  });

  return deploymentRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    deploymentPlanId: plan.id,
    deploymentEnvironmentId: env.id,
    requestedByUserId: input.requestedByUserId || null,
    status: "queued"
  });
}

export async function executeDeploymentRun(runId: string) {
  const run = await deploymentRunsRepository.findById(runId);
  if (!run) throw new Error("Deployment run not found");

  const env = run.deploymentEnvironmentId
    ? await deploymentEnvironmentsRepository.findById(run.deploymentEnvironmentId)
    : null;

  await deploymentRunsRepository.update(runId, {
    status: "deploying",
    startedAt: new Date()
  });

  const result = await executeDeploymentPlan({
    deploymentRunId: runId,
    projectId: run.projectId,
    environment: env?.environmentType || "preview"
  });

  const suggestions = await planDeploymentOptimizations({
    projectId: run.projectId,
    environment: env?.environmentType || "preview"
  });

  for (const item of suggestions) {
    await deploymentOptimizationsRepository.create({
      id: randomUUID(),
      deploymentRunId: runId,
      category: item.category,
      title: item.title,
      description: item.description,
      payloadJson: item.payloadJson || null
    });
  }

  await deploymentRunsRepository.update(runId, {
    status: "completed",
    resultJson: result,
    finishedAt: new Date()
  });

  return deploymentRunsRepository.findById(runId);
}

export async function rollbackDeploymentRun(input: {
  runId: string;
  reason?: string;
}) {
  const result = await executeDeploymentRollback({
    deploymentRunId: input.runId,
    reason: input.reason
  });

  await deploymentRunsRepository.update(input.runId, {
    status: "rolled_back",
    resultJson: result,
    finishedAt: new Date()
  });

  return deploymentRunsRepository.findById(input.runId);
}
