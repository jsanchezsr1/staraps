CREATE TABLE "AgentWorkflow" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "definitionJson" JSONB NOT NULL,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AgentWorkflowStep" (
  "id" TEXT PRIMARY KEY,
  "agentWorkflowId" TEXT NOT NULL,
  "stepKey" TEXT NOT NULL,
  "stepType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "configJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AgentWorkflowExecution" (
  "id" TEXT PRIMARY KEY,
  "agentWorkflowId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "inputJson" JSONB,
  "resultJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE INDEX "AgentWorkflow_project_createdAt_idx"
  ON "AgentWorkflow"("projectId", "createdAt");

CREATE INDEX "AgentWorkflowStep_workflow_createdAt_idx"
  ON "AgentWorkflowStep"("agentWorkflowId", "createdAt");

CREATE INDEX "AgentWorkflowExecution_project_createdAt_idx"
  ON "AgentWorkflowExecution"("projectId", "createdAt");

ALTER TABLE "AgentWorkflow"
  ADD CONSTRAINT "AgentWorkflow_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AgentWorkflow"
  ADD CONSTRAINT "AgentWorkflow_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AgentWorkflowStep"
  ADD CONSTRAINT "AgentWorkflowStep_agentWorkflowId_fkey"
  FOREIGN KEY ("agentWorkflowId") REFERENCES "AgentWorkflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AgentWorkflowExecution"
  ADD CONSTRAINT "AgentWorkflowExecution_agentWorkflowId_fkey"
  FOREIGN KEY ("agentWorkflowId") REFERENCES "AgentWorkflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AgentWorkflowExecution"
  ADD CONSTRAINT "AgentWorkflowExecution_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AgentWorkflowExecution"
  ADD CONSTRAINT "AgentWorkflowExecution_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
