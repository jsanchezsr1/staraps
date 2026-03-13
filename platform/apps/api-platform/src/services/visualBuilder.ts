import { randomUUID } from "crypto";
import { createDefaultCanvas } from "@platform/visual-builder";
import {
  visualBuilderCanvasRepository,
  visualBuilderPatchEventsRepository
} from "@platform/database";

export async function getOrCreateVisualBuilderCanvas(input: {
  projectId: string;
  projectVersionId?: string;
}) {
  const existing = await visualBuilderCanvasRepository.findByProject(input.projectId);
  if (existing) return existing;

  const state = createDefaultCanvas(input.projectId, input.projectVersionId);
  return visualBuilderCanvasRepository.upsert({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    stateJson: state
  });
}

export async function saveVisualBuilderCanvas(input: {
  projectId: string;
  projectVersionId?: string;
  stateJson: Record<string, unknown>;
}) {
  return visualBuilderCanvasRepository.upsert({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    stateJson: input.stateJson
  });
}

export async function createVisualBuilderPatch(input: {
  projectId: string;
  projectVersionId?: string;
  nodeId: string;
  operation: string;
  patchJson?: Record<string, unknown>;
  createdByUserId?: string;
}) {
  return visualBuilderPatchEventsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    nodeId: input.nodeId,
    operation: input.operation,
    patchJson: input.patchJson || null,
    createdByUserId: input.createdByUserId || null
  });
}
