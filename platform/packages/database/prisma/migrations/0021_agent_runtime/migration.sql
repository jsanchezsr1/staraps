CREATE TABLE "AgentRun" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "agentType" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "prompt" TEXT,
  "resultJson" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AgentStepRecord" (
  "id" TEXT PRIMARY KEY,
  "agentRunId" TEXT NOT NULL,
  "stepType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "AgentRun"
ADD CONSTRAINT "AgentRun_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE;

ALTER TABLE "AgentStepRecord"
ADD CONSTRAINT "AgentStepRecord_run_fkey"
FOREIGN KEY ("agentRunId") REFERENCES "AgentRun"("id")
ON DELETE CASCADE;
