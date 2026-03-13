CREATE TABLE "AgentToolInvocation" (
  "id" TEXT PRIMARY KEY,
  "agentRunId" TEXT NOT NULL,
  "toolName" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "inputJson" JSONB,
  "outputJson" JSONB,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ToolRegistryEntry" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "inputSchemaJson" JSONB,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "AgentToolInvocation_agentRun_createdAt_idx"
  ON "AgentToolInvocation"("agentRunId", "createdAt");

ALTER TABLE "AgentToolInvocation"
  ADD CONSTRAINT "AgentToolInvocation_agentRunId_fkey"
  FOREIGN KEY ("agentRunId") REFERENCES "AgentRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
