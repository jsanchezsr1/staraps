CREATE TABLE "ModelProvider" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "displayName" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "modelsJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ModelRouteRule" (
  "id" TEXT PRIMARY KEY,
  "taskType" TEXT NOT NULL,
  "providerName" TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  "priority" INTEGER NOT NULL DEFAULT 1,
  "reason" TEXT,
  "isEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ModelUsageLog" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT,
  "providerName" TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "promptTokens" INTEGER NOT NULL DEFAULT 0,
  "completionTokens" INTEGER NOT NULL DEFAULT 0,
  "totalTokens" INTEGER NOT NULL DEFAULT 0,
  "totalCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ModelCostRecord" (
  "id" TEXT PRIMARY KEY,
  "modelUsageLogId" TEXT NOT NULL,
  "promptCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completionCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "ModelRouteRule_task_priority_idx"
  ON "ModelRouteRule"("taskType", "priority");

CREATE INDEX "ModelUsageLog_project_createdAt_idx"
  ON "ModelUsageLog"("projectId", "createdAt");

ALTER TABLE "ModelUsageLog"
  ADD CONSTRAINT "ModelUsageLog_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ModelCostRecord"
  ADD CONSTRAINT "ModelCostRecord_modelUsageLogId_fkey"
  FOREIGN KEY ("modelUsageLogId") REFERENCES "ModelUsageLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
