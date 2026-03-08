import { randomUUID } from "crypto";
import {
  diffSpecAndCanvas,
  transformCanvasToSpec,
  transformSpecToCanvas
} from "@platform/builder-sync";
import {
  builderRegenerationTriggersRepository,
  builderSyncRunsRepository
} from "@platform/database";

export async function createBuilderSyncRun(input: {
  projectId: string;
  projectVersionId?: string;
  requestedByUserId?: string;
  sourceMode: string;
  specJson?: Record<string, unknown>;
  canvasJson?: Record<string, unknown>;
}) {
  const analysis = await diffSpecAndCanvas({
    specJson: input.specJson,
    canvasJson: input.canvasJson
  });

  const run = await builderSyncRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    requestedByUserId: input.requestedByUserId || null,
    status: "queued",
    sourceMode: input.sourceMode,
    diffJson: analysis.diff,
    conflictsJson: analysis.conflicts
  });

  return run;
}

export async function executeBuilderSyncRun(input: {
  runId: string;
  sourceMode: string;
  projectId: string;
  specJson?: Record<string, unknown>;
  canvasJson?: Record<string, unknown>;
}) {
  await builderSyncRunsRepository.update(input.runId, {
    status: "reconciling",
    startedAt: new Date()
  });

  let resultJson: Record<string, unknown> = {};

  if (input.sourceMode === "spec_to_canvas" || input.sourceMode === "bidirectional") {
    resultJson["canvas"] = await transformSpecToCanvas({
      projectId: input.projectId,
      specJson: input.specJson || {}
    });
  }

  if (input.sourceMode === "canvas_to_spec" || input.sourceMode === "bidirectional") {
    resultJson["spec"] = await transformCanvasToSpec({
      projectId: input.projectId,
      canvasJson: input.canvasJson || {}
    });
  }

  await builderSyncRunsRepository.update(input.runId, {
    status: "completed",
    resultJson,
    finishedAt: new Date()
  });

  return builderSyncRunsRepository.findById(input.runId);
}

export async function createBuilderRegenerationTrigger(input: {
  projectId: string;
  projectVersionId?: string;
  triggerType: string;
  source: string;
  payloadJson?: Record<string, unknown>;
  createdByUserId?: string;
}) {
  return builderRegenerationTriggersRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    triggerType: input.triggerType,
    source: input.source,
    status: "queued",
    payloadJson: input.payloadJson || null,
    createdByUserId: input.createdByUserId || null
  });
}
