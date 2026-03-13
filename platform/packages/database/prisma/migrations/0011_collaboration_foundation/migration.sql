CREATE TABLE "CollaborationSession" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "userId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "startedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP
);

CREATE TABLE "CollaborationPresence" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL,
  "cursorJson" JSONB,
  "selectedNodeId" TEXT,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CollaborationCommentThread" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "createdByUserId" TEXT,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "isResolved" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CollaborationActivityEvent" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "userId" TEXT,
  "eventType" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "CollaborationSession_projectId_lastSeenAt_idx"
  ON "CollaborationSession"("projectId", "lastSeenAt");

CREATE INDEX "CollaborationCommentThread_projectId_createdAt_idx"
  ON "CollaborationCommentThread"("projectId", "createdAt");

CREATE INDEX "CollaborationActivityEvent_projectId_createdAt_idx"
  ON "CollaborationActivityEvent"("projectId", "createdAt");

ALTER TABLE "CollaborationSession"
  ADD CONSTRAINT "CollaborationSession_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollaborationSession"
  ADD CONSTRAINT "CollaborationSession_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollaborationSession"
  ADD CONSTRAINT "CollaborationSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollaborationPresence"
  ADD CONSTRAINT "CollaborationPresence_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "CollaborationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollaborationCommentThread"
  ADD CONSTRAINT "CollaborationCommentThread_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollaborationCommentThread"
  ADD CONSTRAINT "CollaborationCommentThread_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollaborationCommentThread"
  ADD CONSTRAINT "CollaborationCommentThread_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollaborationActivityEvent"
  ADD CONSTRAINT "CollaborationActivityEvent_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollaborationActivityEvent"
  ADD CONSTRAINT "CollaborationActivityEvent_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollaborationActivityEvent"
  ADD CONSTRAINT "CollaborationActivityEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
