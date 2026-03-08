import { randomUUID } from "crypto";
import {
  collaborationSessionsRepository,
  collaborationPresenceRepository,
  collaborationCommentsRepository,
  collaborationActivityRepository
} from "@platform/database";

export async function startCollaborationSession(input: {
  projectId: string;
  projectVersionId?: string;
  userId: string;
}) {
  const session = await collaborationSessionsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    userId: input.userId,
    status: "active"
  });

  await collaborationActivityRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    userId: input.userId,
    eventType: "builder.opened"
  });

  return session;
}

export async function updateCollaborationPresence(input: {
  sessionId: string;
  status: string;
  cursorJson?: Record<string, unknown>;
  selectedNodeId?: string;
}) {
  const presence = await collaborationPresenceRepository.upsert({
    id: randomUUID(),
    sessionId: input.sessionId,
    status: input.status,
    cursorJson: input.cursorJson || null,
    selectedNodeId: input.selectedNodeId || null
  });

  await collaborationSessionsRepository.updateHeartbeat(input.sessionId);
  return presence;
}

export async function createCollaborationComment(input: {
  projectId: string;
  projectVersionId?: string;
  createdByUserId?: string;
  targetType: string;
  targetId: string;
  body: string;
}) {
  const comment = await collaborationCommentsRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    createdByUserId: input.createdByUserId || null,
    targetType: input.targetType,
    targetId: input.targetId,
    body: input.body
  });

  await collaborationActivityRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    userId: input.createdByUserId || null,
    eventType: "builder.comment.created",
    payloadJson: { commentId: comment.id, targetType: input.targetType, targetId: input.targetId }
  });

  return comment;
}

export async function resolveCollaborationComment(input: {
  commentId: string;
  projectId: string;
  projectVersionId?: string;
  userId?: string;
}) {
  const comment = await collaborationCommentsRepository.resolve(input.commentId);

  await collaborationActivityRepository.create({
    id: randomUUID(),
    projectId: input.projectId,
    projectVersionId: input.projectVersionId || null,
    userId: input.userId || null,
    eventType: "builder.comment.resolved",
    payloadJson: { commentId: input.commentId }
  });

  return comment;
}
