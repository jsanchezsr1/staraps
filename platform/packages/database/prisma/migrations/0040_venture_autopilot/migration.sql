CREATE TABLE "VentureAutopilotRun" (
  "id" TEXT PRIMARY KEY,
  "status" TEXT NOT NULL,
  "loopPlanJson" JSONB,
  "summaryJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "VentureAutopilotAction" (
  "id" TEXT PRIMARY KEY,
  "ventureAutopilotRunId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VentureLifecycleDecisionRecord" (
  "id" TEXT PRIMARY KEY,
  "ventureAutopilotRunId" TEXT NOT NULL,
  "decisionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "rationale" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "VentureAutopilotRun_createdAt_idx"
  ON "VentureAutopilotRun"("createdAt");

CREATE INDEX "VentureAutopilotAction_run_createdAt_idx"
  ON "VentureAutopilotAction"("ventureAutopilotRunId", "createdAt");

CREATE INDEX "VentureLifecycleDecisionRecord_run_createdAt_idx"
  ON "VentureLifecycleDecisionRecord"("ventureAutopilotRunId", "createdAt");

ALTER TABLE "VentureAutopilotRun"
  ADD CONSTRAINT "VentureAutopilotRun_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VentureAutopilotAction"
  ADD CONSTRAINT "VentureAutopilotAction_ventureAutopilotRunId_fkey"
  FOREIGN KEY ("ventureAutopilotRunId") REFERENCES "VentureAutopilotRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VentureLifecycleDecisionRecord"
  ADD CONSTRAINT "VentureLifecycleDecisionRecord_ventureAutopilotRunId_fkey"
  FOREIGN KEY ("ventureAutopilotRunId") REFERENCES "VentureAutopilotRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
