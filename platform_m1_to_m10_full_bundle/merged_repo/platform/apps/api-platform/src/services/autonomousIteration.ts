import { randomUUID } from "crypto";
import {
  executeIterationActions,
  planIterationActions,
  planIterationSuggestions
} from "@platform/autonomous-iteration";
import {
  iterationActionRecordsRepository,
  iterationRunsRepository,
  iterationSuggestionRecordsRepository
} from "@platform/database";

export async function createIterationRun(input: {
  projectId: string;
  projectVersionId?: string;
  requestedByUserId?: string;
  contextJson?: Record<string, unknown>;
}) {
  const suggestions = await planIterationSuggestions({
    projectId: input.projectId,
    contextJson: input.contextJson
  });

  const run = await iterationRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    requestedByUserId: input.requestedByUserId || null,
    status: "queued",
    contextJson: input.contextJson || null
  });

  for (const suggestion of suggestions) {
    await iterationSuggestionRecordsRepository.create({
      id: randomUUID(),
      iterationRunId: run.id,
      suggestionType: suggestion.type,
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      payloadJson: suggestion.payloadJson || null
    });
  }

  const actions = await planIterationActions({ suggestions });

  for (const action of actions) {
    await iterationActionRecordsRepository.create({
      id: randomUUID(),
      iterationRunId: run.id,
      actionType: action.type,
      title: action.title,
      status: "queued",
      payloadJson: action.payloadJson || null
    });
  }

  return run;
}

export async function executeIterationRun(runId: string) {
  const run = await iterationRunsRepository.findById(runId);
  if (!run) throw new Error("Iteration run not found");

  await iterationRunsRepository.update(runId, {
    status: "applying",
    startedAt: new Date()
  });

  const actions = await iterationActionRecordsRepository.listByRun(runId);

  const result = await executeIterationActions({
    projectId: run.projectId,
    actions: actions.map((a) => ({
      type: a.actionType as any,
      title: a.title,
      description: a.title,
      payloadJson: (a.payloadJson || {}) as any
    }))
  });

  for (const action of actions) {
    await iterationActionRecordsRepository.update(action.id, {
      status: "completed"
    });
  }

  await iterationRunsRepository.update(runId, {
    status: "completed",
    resultJson: result,
    finishedAt: new Date()
  });

  return iterationRunsRepository.findById(runId);
}
