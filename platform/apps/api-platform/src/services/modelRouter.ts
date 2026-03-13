import { randomUUID } from "crypto";
import { estimateUsageCost, getDefaultModelProviders, routeModelForTask } from "@platform/model-router";
import {
  modelCostRecordsRepository,
  modelProvidersRepository,
  modelRouteRulesRepository,
  modelUsageLogsRepository
} from "@platform/database";

export async function seedModelProviders() {
  const providers = getDefaultModelProviders();
  for (const provider of providers) {
    await modelProvidersRepository.upsert({
      id: randomUUID(),
      name: provider.name,
      displayName: provider.displayName,
      isEnabled: provider.isEnabled,
      modelsJson: provider.models
    });
  }
}

export async function createModelRouteRule(input: {
  taskType: string;
  providerName: string;
  modelName: string;
  priority?: number;
  reason?: string;
}) {
  return modelRouteRulesRepository.create({
    id: randomUUID(),
    taskType: input.taskType,
    providerName: input.providerName,
    modelName: input.modelName,
    priority: input.priority ?? 1,
    reason: input.reason || null,
    isEnabled: true
  });
}

export async function routeModel(input: {
  taskType: any;
}) {
  return routeModelForTask({
    taskType: input.taskType
  });
}

export async function createModelUsageLog(input: {
  projectId?: string;
  taskType: string;
  promptTokens: number;
  completionTokens: number;
}) {
  const decision = await routeModel({
    taskType: input.taskType as any
  });

  const totalTokens = input.promptTokens + input.completionTokens;
  const costs = await estimateUsageCost({
    promptTokens: input.promptTokens,
    completionTokens: input.completionTokens
  });

  const usage = await modelUsageLogsRepository.create({
    id: randomUUID(),
    projectId: input.projectId || null,
    providerName: decision.providerName,
    modelName: decision.modelName,
    taskType: input.taskType,
    promptTokens: input.promptTokens,
    completionTokens: input.completionTokens,
    totalTokens,
    totalCostUsd: costs.totalCostUsd
  });

  await modelCostRecordsRepository.create({
    id: randomUUID(),
    modelUsageLogId: usage.id,
    promptCostUsd: costs.promptCostUsd,
    completionCostUsd: costs.completionCostUsd,
    totalCostUsd: costs.totalCostUsd
  });

  return usage;
}
