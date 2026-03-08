import { randomUUID } from "crypto";
import {
  analyzeRepairDiagnostics,
  executeRepairActions,
  planRepairActions
} from "@platform/auto-repair-engine";
import {
  repairActionRecordsRepository,
  repairDiagnosticRecordsRepository,
  repairRunsRepository
} from "@platform/database";

export async function createRepairRun(input: {
  projectId: string;
  projectVersionId?: string;
  requestedByUserId?: string;
  diagnostics?: string[];
}) {
  const diagnostics = await analyzeRepairDiagnostics({
    projectId: input.projectId,
    diagnostics: input.diagnostics
  });

  const run = await repairRunsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    requestedByUserId: input.requestedByUserId || null,
    status: "queued",
    diagnosticsJson: diagnostics
  });

  for (const d of diagnostics) {
    await repairDiagnosticRecordsRepository.create({
      id: randomUUID(),
      repairRunId: run.id,
      diagnosticType: d.type,
      path: d.path,
      message: d.message,
      severity: d.severity
    });
  }

  const actions = await planRepairActions({ diagnostics });

  for (const action of actions) {
    await repairActionRecordsRepository.create({
      id: randomUUID(),
      repairRunId: run.id,
      actionType: action.type,
      title: action.title,
      status: "queued",
      payloadJson: action.payloadJson || null
    });
  }

  return run;
}

export async function executeRepairRun(runId: string) {
  const run = await repairRunsRepository.findById(runId);
  if (!run) throw new Error("Repair run not found");

  await repairRunsRepository.update(runId, {
    status: "repairing",
    startedAt: new Date()
  });

  const actions = await repairActionRecordsRepository.listByRun(runId);

  const result = await executeRepairActions({
    projectId: run.projectId,
    actions: actions.map((a) => ({
      type: a.actionType as any,
      title: a.title,
      description: a.title,
      payloadJson: (a.payloadJson || {}) as any
    }))
  });

  for (const action of actions) {
    await repairActionRecordsRepository.update(action.id, {
      status: "completed"
    });
  }

  await repairRunsRepository.update(runId, {
    status: "completed",
    resultJson: result,
    finishedAt: new Date()
  });

  return repairRunsRepository.findById(runId);
}
